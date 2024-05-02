import {useRouter} from 'next/router';

const CheckoutPage = () => {
    const router = useRouter();
    const {appointmentId} = router.query;

    return (
        <div>
            <h1>Checkout</h1>
            <p>Appointment ID: {appointmentId}</p>
        </div>
    );
}

export default CheckoutPage;