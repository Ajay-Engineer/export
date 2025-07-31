import { auth, db } from '../config';
import { 
  collection,
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';

const ADMIN_COLLECTION = 'admins';

export const adminService = {
  // Check if a user is an admin
  async isUserAdmin(email) {
    if (!email) return false;
    
    try {
      const q = query(collection(db, ADMIN_COLLECTION), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  // Add a new admin
  async addAdmin(email, role = 'admin') {
    try {
      // Check if admin already exists
      const exists = await this.isUserAdmin(email);
      if (exists) {
        return { success: false, error: { message: 'Admin already exists' } };
      }

      await addDoc(collection(db, ADMIN_COLLECTION), {
        email,
        role,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.email || 'system'
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding admin:', error);
      return { success: false, error };
    }
  },

  // Remove an admin
  async removeAdmin(email) {
    try {
      const q = query(collection(db, ADMIN_COLLECTION), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, error: { message: 'Admin not found' } };
      }

      // Delete the admin document
      await deleteDoc(doc(db, ADMIN_COLLECTION, querySnapshot.docs[0].id));
      return { success: true };
    } catch (error) {
      console.error('Error removing admin:', error);
      return { success: false, error };
    }
  },

  // List all admins
  async listAdmins() {
    try {
      const querySnapshot = await getDocs(collection(db, ADMIN_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error listing admins:', error);
      return [];
    }
  },

  // Verify admin credentials during login
  async verifyAdminCredentials(user) {
    if (!user?.email) return { success: false, error: { message: 'No user email' } };
    
    try {
      const isUserAdmin = await this.isUserAdmin(user.email);
      
      if (!isUserAdmin) {
        return {
          success: false,
          error: {
            code: 'auth/unauthorized',
            message: 'Access denied. Only authorized administrators can login.'
          }
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error verifying admin credentials:', error);
      return { success: false, error };
    }
  }
};
