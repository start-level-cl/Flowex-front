import type { PromoCode } from '../types';

export const availablePromoCodes: PromoCode[] = [
  {
    code: 'FLOW10',
    description: '10% de descuento en el total de tu envío',
    type: 'percentage',
    value: 10
  },
  {
    code: 'DESCUENTO20',
    description: '20% de descuento promocional',
    type: 'percentage',
    value: 20
  },
  {
    code: 'BIENVENIDA5000',
    description: '$5.000 CLP de descuento de bienvenida',
    type: 'fixed',
    value: 5000
  },
  {
    code: 'ENVIOFREE',
    description: 'Flete Base Gratis ($4.500 CLP de descuento)',
    type: 'free_shipping',
    value: 4500
  }
];

export interface ApplyPromoResult {
  isValid: boolean;
  message: string;
  promoCode?: PromoCode;
  discountAmount: number;
}

export function validateAndApplyPromoCode(code: string, currentTotalCost: number): ApplyPromoResult {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { isValid: false, message: '', discountAmount: 0 };
  }

  const found = availablePromoCodes.find(p => p.code === cleanCode);
  if (!found) {
    return {
      isValid: false,
      message: `Código "${cleanCode}" no es válido o está expirado. Usa FLOW10, DESCUENTO20, BIENVENIDA5000 o ENVIOFREE`,
      discountAmount: 0
    };
  }

  let discountAmount = 0;
  if (found.type === 'percentage') {
    discountAmount = Math.round((currentTotalCost * found.value) / 100);
  } else if (found.type === 'fixed') {
    discountAmount = Math.min(currentTotalCost, found.value);
  } else if (found.type === 'free_shipping') {
    discountAmount = Math.min(currentTotalCost, found.value);
  }

  return {
    isValid: true,
    message: `¡Código aplicado! ${found.description}`,
    promoCode: found,
    discountAmount
  };
}
