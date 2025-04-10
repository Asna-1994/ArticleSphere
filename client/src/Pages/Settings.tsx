import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../Components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { updateUserData } from "../services/userServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../Redux/slices/authSlice";

export interface updateProfileData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dob?: Date | string;
}

const Settings = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const formatDateForInput = (date: Date | string | null | undefined): string => {
        if (!date) {
            return "";
        }
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [dob, setDob] = useState(formatDateForInput(user?.dob));
    const dispatch = useDispatch()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName.trim()) return toast.error("First name is required");
        if (!lastName.trim()) return toast.error("Last name is required");
        if (!email.trim()) return toast.error("Email is required");
        if (!phone.trim()) return toast.error("Phone number is required");
        if (!dob) return toast.error("Date of birth is required");

        const updatedData = {
            firstName,
            lastName,
            email,
            phone,
            dob,
        };

        try {
           const response = await updateUserData(updatedData)
           if(response.data.success){
            toast.success("Settings updated successfully!");
       const{ user} = response.data
       console.log(user)
            dispatch(updateUser({user}))

           }else{
            toast.error(response.data.message)
           }
      
        } catch (error: any) {
            toast.error(error.message || "Failed to update settings");
        }
    };

    return (
        <div>
            <Header />
            <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Account Settings</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
          
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                        </div>

                    </div>

                    {/* Right Column - Password & Preferences */}

                    <div className="space-y-4">
                    <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>

                    {/* Submit Button spanning full width */}
                    <div className="col-span-1 md:col-span-2 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;