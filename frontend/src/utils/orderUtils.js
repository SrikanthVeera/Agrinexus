import { db } from "../firebase";
import {
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  doc,
  arrayUnion,
} from "firebase/firestore";

/**
 * Place an order and auto-assign a delivery partner.
 * @param {Object} orderData - The order data (must include deliveryLocation).
 * @returns {Promise<string>} - The new order ID.
 */
export async function placeOrder(orderData) {
  try {
    // 1. Add order to Firestore
    const orderRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      assignedDeliveryPartnerId: null,
      createdAt: new Date(),
    });
    const orderId = orderRef.id;

    // 2. Auto-assign delivery partner
    await autoAssignDeliveryPartner(orderId, orderData.deliveryLocation);

    return orderId;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}

/**
 * Auto-assigns a delivery partner to an order based on location and availability.
 * @param {string} orderId - The Firestore order document ID.
 * @param {string} location - The delivery location.
 */
export async function autoAssignDeliveryPartner(orderId, location) {
  try {
    // 1. Query for available delivery partners in the same location
    const partnersQuery = query(
      collection(db, "delivery_partners"),
      where("location", "==", location),
      where("status", "==", "Available")
    );
    const partnersSnap = await getDocs(partnersQuery);

    if (partnersSnap.empty) {
      throw new Error("No available delivery partner in this location.");
    }

    // 2. Pick the first available partner (or use your own logic)
    const partnerDoc = partnersSnap.docs[0];
    const partnerId = partnerDoc.id;

    // 3. Update the order with assignedDeliveryPartnerId
    await updateDoc(doc(db, "orders", orderId), {
      assignedDeliveryPartnerId: partnerId,
    });

    // 4. Update the delivery partner: set status to Busy, add orderId to assignedOrders
    await updateDoc(doc(db, "delivery_partners", partnerId), {
      status: "Busy",
      assignedOrders: arrayUnion(orderId),
    });
  } catch (error) {
    console.error("Error assigning delivery partner:", error);
    throw error;
  }
}
