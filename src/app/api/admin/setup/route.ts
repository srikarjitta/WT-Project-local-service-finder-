import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/setup
 * Checks the status of the admin suite and Supabase tables.
 */
export async function GET() {
  try {
    const adminClient = createAdminClient();

    // 1. Check profiles with role = 'admin'
    const { data: adminProfiles, error: profErr } = await adminClient
      .from("profiles")
      .select("id, full_name, role, created_at")
      .eq("role", "admin");

    if (profErr) {
      return NextResponse.json(
        { success: false, error: profErr.message },
        { status: 500 }
      );
    }

    // 2. Count categories
    const { count: catCount } = await adminClient
      .from("categories")
      .select("*", { count: "exact", head: true });

    // 3. Count businesses
    const { count: bizCount } = await adminClient
      .from("businesses")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      status: "connected",
      adminCount: adminProfiles?.length || 0,
      adminUsers: adminProfiles?.map((a) => ({
        id: a.id,
        name: a.full_name,
        role: a.role,
      })),
      databaseCounts: {
        categories: catCount || 0,
        businesses: bizCount || 0,
      },
      instructions:
        adminProfiles && adminProfiles.length > 0
          ? "Admin accounts are configured. Log in at /admin/login."
          : "No admin accounts found. Send a POST request to /api/admin/setup to create the default super admin.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to inspect database" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/setup
 * Creates or resets the default super admin account.
 */
export async function POST(request: Request) {
  try {
    const adminClient = createAdminClient();
    const body = await request.json().catch(() => ({}));
    const email = body.email || "admin@servifind.com";
    const password = body.password || "Admin@ServiFind2026!";
    const fullName = body.fullName || "ServiFind Super Admin";

    // 1. Check if user already exists in auth
    const { data: list } = await adminClient.auth.admin.listUsers();
    const existing = list?.users?.find((u) => u.email === email);
    let userId: string;

    if (existing) {
      userId = existing.id;
      // Update password
      await adminClient.auth.admin.updateUserById(userId, { password });
    } else {
      const { data: newUser, error: createErr } =
        await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName, role: "admin" },
        });

      if (createErr || !newUser?.user) {
        return NextResponse.json(
          { success: false, error: createErr?.message || "Failed to create user" },
          { status: 400 }
        );
      }
      userId = newUser.user.id;
    }

    // 2. Upsert profile with admin role
    const { error: profErr } = await adminClient
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName,
        role: "admin",
        updated_at: new Date().toISOString(),
      });

    if (profErr) {
      return NextResponse.json(
        { success: false, error: profErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Admin user '${email}' configured successfully.`,
      email,
      loginUrl: "/admin/login",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server setup error" },
      { status: 500 }
    );
  }
}

