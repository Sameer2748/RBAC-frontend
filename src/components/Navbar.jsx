import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { manageState, userState } from "../../store/userAtom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = ({onClick}) => {
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate()
    const [manage, setManage] = useRecoilState(manageState);


    useEffect(() => {
        const fetchUserDetails = async () => {
          const token = localStorage.getItem('token'); // Get token from localStorage
          if (token) {
            try {
              // Use the token to fetch user details from your API
              const res = await axios.get('https://rbac-backend-wc6u.onrender.com/api/v1/user/', {
                headers: { Authorization: `${token}` },
              });
    
              // Update the Recoil state with user details
              setUser({
                id: res.data.user.id,
                name: res.data.user.name,
                email: res.data.user.email,
                role: res.data.user.role,
                status: res.data.user.status,
                token, // Keep the token in state for other API calls
              });
            } catch (error) {
              console.error('Error fetching user details:', error);
              localStorage.removeItem('token'); // Remove token if it's invalid
            }
          }
        };
        fetchUserDetails();
      }, [setUser]);
      

    const handleLogOut = async() => {
      setUser({ id: null, name: "", email: "", role: "", status: "", token: null });
      await localStorage.removeItem('token');
      setManage(false)
      navigate("/")
    };

  return (
    <div className="text-[20px] w-full h-[15vh] flex justify-center items-center -top-100 relative ">
      <div className="flex justify-between items-center w-[90%] md:[80%] lg:[80%] h-[3vh] bg-white/30 backdrop-blur-lg rounded-xl p-5 md:p-7 lg:p-10 shadow-xl rounded-xl mt-3  ">
        <h1 className="text-[22px] font-bold p-2 text-white md:text-[34px] lg:text-[40px]  ">RBAC</h1>
        <div>
          <ul className="flex justify-between items-center text-[20px]  text-white  gap-4">
            <li className="cursor-pointer hover:underline hover:text-gray-800 hover:text-[22px]" onClick={(e)=> onClick(e,"home")}>Home</li>
            {
              user.role === "Admin" && (
                <li className="cursor-pointer hover:underline hover:text-gray-800 hover:text-[22px]" onClick={(e)=> setManage(true)}>Manage</li>
              )
            }
            {user.name !== "" ? (
              <>
              <li className="cursor-pointer text-orange-400">{user.name}</li>
              </>
            ) : (
              <>
                <li className="cursor-pointer hover:underline hover:text-gray-800 hover:text-[22px]" onClick={(e)=> onClick(e,"register")}>Register</li>
                <li className="cursor-pointer hover:underline hover:text-gray-800 hover:text-[22px]" onClick={(e)=> onClick(e,"login")}>Login</li>
              </>
            )}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;
