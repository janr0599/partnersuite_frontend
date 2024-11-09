import { ticketsSchema } from "@/schemas/ticketsShemas";
import { z } from "zod";

export type Ticket = z.infer<typeof ticketsSchema>;
