import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number, transaction: string) => {
  const formatted = new Intl.NumberFormat('fr-FR').format(price);
  return transaction === 'Location' ? `${formatted} FCFA/mois` : `${formatted} FCFA`;
};
