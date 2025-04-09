
import { z } from "zod";

// Validation schema for the investment form
export const investmentFormSchema = z.object({
  type: z.string({
    required_error: "Selecciona el tipo de inversión",
  }),
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  symbol: z.string().min(1, {
    message: "El símbolo es requerido",
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "La cantidad debe ser un número mayor a 0",
  }),
  purchasePrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El precio de compra debe ser un número mayor a 0",
  }),
  purchaseDate: z.string().min(1, {
    message: "La fecha de compra es requerida",
  }),
});

export type InvestmentFormValues = z.infer<typeof investmentFormSchema>;
