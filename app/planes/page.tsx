import StripeCheckout from '@/components/StripeCheckout';

export default function PlanesPage() {
  return (
    <div className="pricing-card">
      <h3>Plan Pro</h3>
      <p className="price">$499/mes</p>
      
      <StripeCheckout planId="pro_monthly">
        <span>Suscribirme Ahora</span>
      </StripeCheckout>
    </div>
  );
}
