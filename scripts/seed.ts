/**
 * Firestore/Auth seed script for local development.
 *
 * Setup (pick one):
 *   1. Set GOOGLE_APPLICATION_CREDENTIALS to the path of a Firebase service
 *      account JSON key file, OR
 *   2. Place that key file at ./serviceAccountKey.json (repo root — already
 *      gitignored), OR
 *   3. Set SEED_SERVICE_ACCOUNT_JSON to the key file's JSON contents as a
 *      single-line string (useful in CI).
 *
 * Usage:
 *   npm run seed             # seed (refuses to run if seed data already exists)
 *   npm run seed -- --reset  # wipe prior seed data first, then reseed
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { cert, initializeApp } from "firebase-admin/app";
import type { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  type Firestore,
  type WriteBatch,
} from "firebase-admin/firestore";

// ---------------------------------------------------------------------------
// SAFETY CHECK — this must run, and pass, before any other read/write.
// ---------------------------------------------------------------------------

const EXPECTED_PROJECT_ID = "realtore-test";

interface ServiceAccountKey {
  project_id: string;
  client_email: string;
  private_key: string;
  [key: string]: unknown;
}

function loadServiceAccount(): ServiceAccountKey {
  if (process.env.SEED_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.SEED_SERVICE_ACCOUNT_JSON) as ServiceAccountKey;
  }

  const keyPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ??
    path.resolve(process.cwd(), "serviceAccountKey.json");

  if (existsSync(keyPath)) {
    return JSON.parse(readFileSync(keyPath, "utf-8")) as ServiceAccountKey;
  }

  throw new Error(
    "No service account credentials found. Set SEED_SERVICE_ACCOUNT_JSON, " +
      "or GOOGLE_APPLICATION_CREDENTIALS, or place a service account key at " +
      `${keyPath}. See the header comment in scripts/seed.ts for details.`
  );
}

function initAdmin(): App {
  const serviceAccount = loadServiceAccount();
  const app = initializeApp({
    credential: cert(serviceAccount as never),
    projectId: serviceAccount.project_id,
  });

  const actualProjectId = app.options.projectId;
  if (actualProjectId !== EXPECTED_PROJECT_ID) {
    throw new Error(
      `Refusing to run: credentials point to project '${actualProjectId}', ` +
        `expected '${EXPECTED_PROJECT_ID}'. Update EXPECTED_PROJECT_ID or check ` +
        "your service account file."
    );
  }

  console.log(`Confirmed project: ${actualProjectId}`);
  return app;
}

// ---------------------------------------------------------------------------
// Config / constants
// ---------------------------------------------------------------------------

const USER_COUNT = 20;
const LISTING_COUNT = 100;
const SHARED_PASSWORD = "Test1234!";
const SEED_TAG = "realtore-seed-v1"; // marks docs this script owns, for safe --reset
const SEED_META_COLLECTION = "_seedMeta";
const SEED_META_DOC = "status";

// ---------------------------------------------------------------------------
// Lightweight fake-data generation (no external dependency)
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  "Olivia", "Liam", "Emma", "Noah", "Ava", "Elijah", "Sophia", "James",
  "Isabella", "Benjamin", "Mia", "Lucas", "Amelia", "Henry", "Harper",
  "Alexander", "Evelyn", "Sebastian", "Charlotte", "Jack",
];
const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
  "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];
const STREET_NAMES = [
  "Maple Ave", "Oak St", "Cedar Ln", "Sunset Blvd", "Elm St", "Pine Rd",
  "River Rd", "Willow Way", "Highland Dr", "Lakeview Ct", "Birch St",
  "Meadow Ln", "Hillcrest Ave", "Park Pl", "Chestnut St",
];
const CITIES: { city: string; state: string }[] = [
  { city: "Austin", state: "TX" },
  { city: "Denver", state: "CO" },
  { city: "Portland", state: "OR" },
  { city: "Raleigh", state: "NC" },
  { city: "Phoenix", state: "AZ" },
  { city: "Nashville", state: "TN" },
  { city: "Columbus", state: "OH" },
  { city: "Sacramento", state: "CA" },
  { city: "Orlando", state: "FL" },
  { city: "Boise", state: "ID" },
];
const ADJECTIVES = [
  "Sunny", "Charming", "Modern", "Cozy", "Spacious", "Elegant", "Rustic",
  "Bright", "Quiet", "Stylish", "Historic", "Renovated", "Luxury", "Chic",
];
const PROPERTY_NOUNS = [
  "Loft", "Cottage", "Bungalow", "Townhouse", "Retreat", "Residence",
  "Villa", "Apartment", "Ranch", "Estate", "Studio", "Duplex",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function randomPastDate(daysBack: number): Date {
  const now = Date.now();
  const offsetMs = randomInt(0, daysBack) * 24 * 60 * 60 * 1000;
  return new Date(now - offsetMs);
}

function generateName(): { first: string; last: string; full: string } {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  return { first, last, full: `${first} ${last}` };
}

function generateAddress(): string {
  const { city, state } = pick(CITIES);
  const streetNumber = randomInt(100, 9999);
  const street = pick(STREET_NAMES);
  const zip = randomInt(10000, 99999);
  return `${streetNumber} ${street}, ${city}, ${state} ${zip}`;
}

function generatePropertyName(): string {
  return `${pick(ADJECTIVES)} ${pick(PROPERTY_NOUNS)}`;
}

function generateDescription(
  type: "rent" | "sale",
  bedrooms: number,
  bathrooms: number,
  furnished: boolean,
  parking: boolean
): string {
  const action = type === "rent" ? "available for rent" : "available for sale";
  const furnishedPart = furnished ? "fully furnished" : "unfurnished";
  const parkingPart = parking ? "a dedicated parking spot" : "street parking only";
  return (
    `A ${pick(ADJECTIVES).toLowerCase()} ${bedrooms}-bedroom, ${bathrooms}-bathroom ` +
    `home ${action}. This ${furnishedPart} property offers ${parkingPart}, ` +
    "close to schools, shops, and public transit."
  );
}

// Deterministic, no-API-key placeholder photos — NOT real uploads to Firebase
// Storage. Good enough to give the UI real <img> content to render.
function generateImgUrls(seed: string): string[] {
  const count = randomInt(1, 5);
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/seed/${seed}-${i}/900/600`
  );
}

function generateGeolocation(): { lat: number; lng: number } {
  // Roughly the continental US bounding box.
  return {
    lat: Number(randomFloat(25, 49).toFixed(6)),
    lng: Number(randomFloat(-124, -67).toFixed(6)),
  };
}

// ---------------------------------------------------------------------------
// Seed data shapes (mirrors the real app schema — see CreateListing.tsx,
// EditListing.tsx, OAuth.tsx/SignUp.tsx, and firestore.rules)
// ---------------------------------------------------------------------------

interface SeedUserDoc {
  name: string;
  email: string;
  avatar: string | null;
  timestamp: FirebaseFirestore.FieldValue;
  seedTag: string;
}

interface SeedListingDoc {
  type: "rent" | "sale";
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  description: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice?: number;
  imgUrls: string[];
  geolocation: { lat: number; lng: number };
  timestamp: Timestamp;
  userRef: string;
  seedTag: string;
}

// ---------------------------------------------------------------------------
// Reset: wipe only documents this script tagged, plus the 20 seed Auth users
// ---------------------------------------------------------------------------

async function deleteTaggedDocs(db: Firestore, collectionName: string): Promise<number> {
  const snap = await db
    .collection(collectionName)
    .where("seedTag", "==", SEED_TAG)
    .get();

  if (snap.empty) return 0;

  const chunks: FirebaseFirestore.QueryDocumentSnapshot[][] = [];
  for (let i = 0; i < snap.docs.length; i += 400) {
    chunks.push(snap.docs.slice(i, i + 400));
  }

  for (const chunk of chunks) {
    const batch = db.batch();
    chunk.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  return snap.size;
}

async function resetSeedData(app: App): Promise<void> {
  const db = getFirestore(app);
  const auth = getAuth(app);

  console.log("--reset: wiping prior seed data...");

  const deletedListings = await deleteTaggedDocs(db, "listings");
  console.log(`  Deleted ${deletedListings} tagged listing(s).`);

  const deletedUserDocs = await deleteTaggedDocs(db, "users");
  console.log(`  Deleted ${deletedUserDocs} tagged user profile doc(s).`);

  let deletedAuthUsers = 0;
  for (let i = 1; i <= USER_COUNT; i++) {
    const email = `testuser${i}@example.com`;
    try {
      const user = await auth.getUserByEmail(email);
      await auth.deleteUser(user.uid);
      deletedAuthUsers++;
    } catch (error) {
      if ((error as { code?: string }).code !== "auth/user-not-found") throw error;
    }
  }
  console.log(`  Deleted ${deletedAuthUsers} seed Auth user(s).`);

  await db.collection(SEED_META_COLLECTION).doc(SEED_META_DOC).delete().catch(() => {});
  console.log("Reset complete.\n");
}

// ---------------------------------------------------------------------------
// Seed: 20 Auth users + Firestore profiles, then 100 listings
// ---------------------------------------------------------------------------

interface SeededUser {
  uid: string;
  email: string;
  displayName: string;
}

async function seedUsers(app: App): Promise<SeededUser[]> {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const seeded: SeededUser[] = [];

  for (let i = 1; i <= USER_COUNT; i++) {
    const email = `testuser${i}@example.com`;
    const { full: displayName } = generateName();

    let uid: string;
    try {
      const userRecord = await auth.createUser({
        email,
        password: SHARED_PASSWORD,
        displayName,
        emailVerified: true,
      });
      uid = userRecord.uid;
    } catch (error) {
      if ((error as { code?: string }).code === "auth/email-already-exists") {
        // Resuming a previously interrupted run — reuse the existing user.
        const existing = await auth.getUserByEmail(email);
        uid = existing.uid;
      } else {
        throw error;
      }
    }

    const userDoc: SeedUserDoc = {
      name: displayName,
      email,
      avatar: null,
      timestamp: FieldValue.serverTimestamp(),
      seedTag: SEED_TAG,
    };
    await db.collection("users").doc(uid).set(userDoc);

    seeded.push({ uid, email, displayName });
    console.log(`  Created user ${i}/${USER_COUNT}: ${email}`);
  }

  return seeded;
}

async function seedListings(app: App, users: SeededUser[]): Promise<{ rent: number; sale: number; offers: number }> {
  const db = getFirestore(app);
  const stats = { rent: 0, sale: 0, offers: 0 };

  const chunks: SeedListingDoc[][] = [];
  let current: SeedListingDoc[] = [];

  for (let i = 0; i < LISTING_COUNT; i++) {
    const type: "rent" | "sale" = Math.random() < 0.5 ? "rent" : "sale";
    const bedrooms = randomInt(1, 6);
    const bathrooms = randomInt(1, Math.min(5, bedrooms + 1));
    const parking = Math.random() < 0.6;
    const furnished = Math.random() < 0.4;
    const offer = Math.random() < 0.3;
    const regularPrice =
      type === "rent" ? randomInt(800, 6000) : randomInt(120_000, 2_500_000);
    const discountedPrice = offer
      ? Math.round(regularPrice * randomFloat(0.75, 0.95))
      : undefined;
    const owner = pick(users);

    const doc: SeedListingDoc = {
      type,
      name: generatePropertyName(),
      bedrooms,
      bathrooms,
      parking,
      furnished,
      address: generateAddress(),
      description: generateDescription(type, bedrooms, bathrooms, furnished, parking),
      offer,
      regularPrice,
      ...(offer && discountedPrice !== undefined ? { discountedPrice } : {}),
      imgUrls: generateImgUrls(`listing-${i}`),
      geolocation: generateGeolocation(),
      timestamp: Timestamp.fromDate(randomPastDate(365)),
      userRef: owner.uid,
      seedTag: SEED_TAG,
    };

    stats[type]++;
    if (offer) stats.offers++;
    current.push(doc);

    if (current.length === 400) {
      chunks.push(current);
      current = [];
    }
  }
  if (current.length > 0) chunks.push(current);

  let written = 0;
  for (const chunk of chunks) {
    const batch: WriteBatch = db.batch();
    for (const doc of chunk) {
      const ref = db.collection("listings").doc();
      batch.set(ref, doc);
    }
    await batch.commit();
    written += chunk.length;
    console.log(`  Seeded ${written}/${LISTING_COUNT} listings...`);
  }

  return stats;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function printUserTable(users: SeededUser[]): void {
  console.log("\n| # | Email | Password | Display Name |");
  console.log("|---|-------|----------|---------------|");
  users.forEach((user, i) => {
    console.log(`| ${i + 1} | ${user.email} | ${SHARED_PASSWORD} | ${user.displayName} |`);
  });
  console.log("");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const app = initAdmin(); // safety check happens inside; throws on mismatch
  const db = getFirestore(app);
  const shouldReset = process.argv.includes("--reset");

  if (shouldReset) {
    await resetSeedData(app);
  }

  const marker = await db.collection(SEED_META_COLLECTION).doc(SEED_META_DOC).get();
  if (marker.exists && !shouldReset) {
    const data = marker.data();
    console.log(
      `Seed data already exists (seeded at ${data?.seededAt?.toDate?.() ?? "unknown"}, ` +
        `${data?.userCount ?? "?"} users, ${data?.listingCount ?? "?"} listings).`
    );
    console.log("Re-run with --reset to wipe and reseed: npm run seed -- --reset");
    return;
  }

  console.log(`\nSeeding ${USER_COUNT} users...`);
  const users = await seedUsers(app);

  console.log(`\nSeeding ${LISTING_COUNT} listings...`);
  const listingStats = await seedListings(app, users);

  await db
    .collection(SEED_META_COLLECTION)
    .doc(SEED_META_DOC)
    .set({
      seedTag: SEED_TAG,
      seededAt: FieldValue.serverTimestamp(),
      userCount: users.length,
      listingCount: LISTING_COUNT,
    });

  console.log("\n=== Seed complete ===");
  console.log(`Users created:    ${users.length}`);
  console.log(`Listings created: ${LISTING_COUNT}`);
  console.log(`  - rent: ${listingStats.rent}, sale: ${listingStats.sale}, with offer: ${listingStats.offers}`);

  printUserTable(users);
}

main().catch((error) => {
  console.error(`\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
