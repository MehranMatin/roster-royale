import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const testUsers = [
  // Heroes
  {
    id: "9a408bde-4c30-4069-a42f-89536f40cb77",
    email: "batman@dc.com",
    password: "hero123",
    first_name: "Bruce",
    last_name: "Wayne",
  },
  {
    id: "a03af806-c64a-468d-97a1-1e2a2f987fc2",
    email: "nightwing@dc.com",
    password: "hero123",
    first_name: "Dick",
    last_name: "Grayson",
  },
  {
    id: "a2e6ee23-74ef-40d5-b92d-032ac54da039",
    email: "batgirl@dc.com",
    password: "hero123",
    first_name: "Barbara",
    last_name: "Gordon",
  },
  {
    id: "a3e6ee23-74ef-40d5-b92d-032ac54da039",
    email: "robin@dc.com",
    password: "hero123",
    first_name: "Tim",
    last_name: "Drake",
  },
  // Villains
  {
    id: "d4c45bb0-4100-4de1-9b85-b7bbd24456e4",
    email: "joker@dc.com",
    password: "villain123",
    first_name: "The",
    last_name: "Joker",
  },
  {
    id: "dc94f120-5d6f-45fa-8f00-ebe93f20e3f1",
    email: "penguin@dc.com",
    password: "villain123",
    first_name: "Oswald",
    last_name: "Cobblepot",
  },
  {
    id: "e98675f1-0f08-41c1-8169-a63632c32d7f",
    email: "riddler@dc.com",
    password: "villain123",
    first_name: "Edward",
    last_name: "Nygma",
  },
  {
    id: "c78d8bcd-f92c-417a-bcae-9a50888f5622",
    email: "bane@dc.com",
    password: "villain123",
    first_name: "Bane",
    last_name: "",
  },
];

async function seedAuthAndProfiles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  for (const user of testUsers) {
    // Create auth user
    const { error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      id: user.id,
    });
    if (authError) throw authError;
    console.log(`Created auth user: ${user.email}`);

    // Create profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    if (profileError) throw profileError;
    console.log(`Created profile for: ${user.email}`);
  }
}

seedAuthAndProfiles().catch(console.error);
