import { z } from "zod";

export const businessProfileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters").max(100),
  category_id: z.string().uuid("Please select a valid category"),
  tagline: z.string().max(120).optional().nullable(),
  description: z.string().min(10, "Please provide a detailed description (at least 10 characters)"),
  phone: z.string().min(7, "Please enter a valid phone number").max(20),
  whatsapp: z.string().max(20).optional().nullable(),
  email: z.string().email("Please enter a valid email address").optional().nullable().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().nullable().or(z.literal("")),
  address: z.string().min(5, "Street address must be at least 5 characters"),
  locality: z.string().min(2, "Locality / neighborhood is required"),
  city: z.string().min(2, "City is required"),
  postal_code: z.string().min(3, "Postal code is required"),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;

export const serviceItemSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters").max(100),
  description: z.string().max(500).optional().nullable(),
  price_type: z.enum(["fixed", "range", "contact"]),
  price_min: z.number().min(0, "Price must be non-negative").optional().nullable(),
  price_max: z.number().min(0, "Price must be non-negative").optional().nullable(),
}).refine((data) => {
  if (data.price_type === "range" && data.price_min != null && data.price_max != null) {
    return data.price_max >= data.price_min;
  }
  return true;
}, {
  message: "Maximum price must be greater than or equal to minimum price",
  path: ["price_max"],
});

export type ServiceItemInput = z.infer<typeof serviceItemSchema>;

export const singleDayHoursSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  open_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  close_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  is_closed: z.boolean(),
});

export const businessHoursSchema = z.array(singleDayHoursSchema);
export type BusinessHoursInput = z.infer<typeof businessHoursSchema>;

export const enquiryUpdateSchema = z.object({
  status: z.enum(["new", "in_progress", "responded", "closed"]),
  owner_notes: z.string().max(1000).optional().nullable(),
});

export type EnquiryUpdateInput = z.infer<typeof enquiryUpdateSchema>;
