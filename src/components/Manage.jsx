import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { allusersforAdmin } from "../../store/userAtom";
import axios from "axios";
import { toast } from "sonner";

const Manage = () => {
  const [allusers, setAllUsers] = useRecoilState(allusersforAdmin);
  const [selecteduser, setSelectedUser] = useState({});
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [openDelete, setOpenDelete]  = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [view, setView] = useState(false);

  const [data, setData] = useState({
    userId: selecteduser._id,
    role: selecteduser.role || "Client",
    status: selecteduser.status || "Active",
  });
  const [deleteId, setDeleteId]  = useState("")
  // Fetch users from API when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://rbac-backend-wc6u.onrender.com/api/v1/admin/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setAllUsers(res.data.user);
      console.log(res.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    const user = allusers.find((user) => user._id === id);
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
    setSelectedUser({});
    setOpenDelete(false)
  };

  const hnadleSaveEdit = async (id) => {
    setData((prev) => ({ ...prev, userId: id }));
    console.log(data);
    console.log(selecteduser);
    try {
      const res = await axios.post(
        `https://rbac-backend-wc6u.onrender.com/api/v1/admin/update`,
        {
          role: data.role,
          status: data.status,
          userId: selecteduser._id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selecteduser._id
            ? { ...user, role: data.role, status: data.status } // Update the user
            : user
        )
      );

      toast("user updated successfully");
      setData({
        role: "",
        status: "",
        userId: "",
      });
      setOpenEdit(false);
      setSelectedUser({});
    } catch (error) {
      toast("error", error.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await axios.post(
        `https://rbac-backend-wc6u.onrender.com/api/v1/admin/delete/`,
        { userId: id },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

      toast("user deleted successfully");
      setDeleteId("")
      setOpenDelete(false)
      setSelectedUser({});
    } catch (error) {
      toast("error", error.message);
    }
  };

  const handleOpenDelete= async(id)=>{
    setDeleteId(id)
    setOpenDelete(true)
  }

  return (
    <div className="w-full h-full text-white px-5 overflow-hidden">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-bold">Manage Users</h1>

        <div className="h-[100%]">
          {view === true ? (
            <button
              onClick={() => setView(false)}
              className="w-auto h-auto flex justy-center items-center text-white border border-gray-500 p-2"
            >
              Grid View
            </button>
          ) : (
            <button
              onClick={() => setView(true)}
              className="w-auto h-auto flex justy-center items-center text-white border border-gray-500 p-2"
            >
              List View
            </button>
          )}
        </div>
      </div>
      {/* Edit Modal */}
      {openEdit && (
        <>
          <div className="fixed top-0 left-0 w-full h-screen bg-black opacity-50 z-50"></div>
          <div className="fixed top-1/2 left-1/2 w-2/2 lg:w-2/6 md:h-2/2 lg:h-2/2 h-1/2 bg-gray-700 rounded-md shadow-md p-5 transform -translate-x-1/2 -translate-y-1/2 z-[99]">
            <button
              onClick={handleClose}
              className="text-white text-[30px] fixed top-0 right-5"
            >
              x
            </button>
            <h2 className="text-center font-bold text-[20px] pb-2">
              Edit User
            </h2>
            <div className="w-full h-[2px] bg-white rounded-xl"></div>
            {/* Edit form */}
            <div className="w-full h-[90%] flex flex-col justify-between items-center">
              <div className="w-full   flex flex-col gap-6">
                <div className="w-full flex flex-col md:flex-row lg:flex-row  justify-between items-center mt-5">
                  <div className="w-full md:w-[49%] lg:w-[49%] flex flex-col gap-1 ">
                    <p className="pl-1 text-[20px]">Name*</p>
                    <input
                      value={selecteduser.name}
                      className="w-full p-2 rounded-xl  bg-transparent focus:outline-none border border-gray-400 text-white focus:ring-none"
                      type="text"
                      placeholder={selecteduser.name}
                    />
                  </div>
                  <div className="w-full md:w-[49%] lg:w-[49%] flex flex-col gap-1">
                    <p className="pl-1 text-[20px]">Email*</p>
                    <input
                      value={selecteduser.email}
                      className="w-full p-2 rounded-xl  bg-transparent focus:outline-none border border-gray-400 text-white focus:ring-none"
                      type="text"
                      placeholder={selecteduser.email}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-4 ">
                  <p className="text-[20px]">Role:</p>
                  <p
                    onClick={() =>
                      setData((prev) => ({ ...prev, role: "Admin" }))
                    }
                    className={`w-[30%] h-[30px] p-2 text-white rounded-xl bg-gray-500 flex justify-center border-black  items-center ${
                      data.role === "Admin" ? "border border-white" : ""
                    } cursor-pointer `}
                  >
                    Admin
                  </p>
                  <p
                    onClick={() =>
                      setData((prev) => ({ ...prev, role: "Client" }))
                    }
                    className={`w-[30%] h-[30px] p-2 text-white rounded-xl bg-gray-500 flex justify-center  items-center ${
                      data.role === "Client" ? "border border-white" : ""
                    } cursor-pointer `}
                  >
                    Client
                  </p>
                </div>
                <div className="flex w-full gap-4 ">
                  <p className="text-[20px]">Status:</p>
                  <p
                    onClick={() =>
                      setData((prev) => ({ ...prev, status: "Active" }))
                    }
                    className={`w-[30%] h-[30px] p-2 text-white rounded-xl bg-gray-500 flex justify-center border-black  items-center ${
                      data.status === "Active" ? "border border-white" : ""
                    } cursor-pointer `}
                  >
                    Active
                  </p>
                  <p
                    onClick={() =>
                      setData((prev) => ({ ...prev, status: "Inactive" }))
                    }
                    className={`w-[30%] h-[30px] p-2 text-white rounded-xl bg-gray-500 flex justify-center  items-center ${
                      data.status === "Inactive" ? "border border-white" : ""
                    } cursor-pointer `}
                  >
                    InActive
                  </p>
                </div>
              </div>
              <button
                className="mt-5 p-2 w-full rounded-md bg-blue-500 text-white"
                onClick={() => hnadleSaveEdit(selecteduser._id)}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
      {/* Delete Modal */}
      {openDelete && (
        <>
          <div className="fixed top-0 left-0 w-full h-screen bg-black opacity-50 z-50"></div>
          <div className="fixed top-1/2 left-1/2 w-2/2 h-1/6 bg-gray-700 rounded-md shadow-md p-5 transform -translate-x-1/2 -translate-y-1/2 z-[99]">
          <p className="text-center text-white text-[20px]">Are you sure you want to Delete this user?</p>
          <div className="w-full flex gap-3 justify-center items-center mt-3">
          <button className="text-white  w-[60px] h-[30px] bg-gray-500 border border-white rounded-lg" onClick={handleClose}>Cancel</button>
          <button onClick={()=> handleDelete(deleteId)} className="text-white  w-[60px] h-[30px] bg-red-700 border border-white rounded-lg ">Delete</button>
          </div>
          </div>
        </>
      )}

      {/* Users List */}
      {!view ? (
        <div className="w-full h-auto">
          <h1 className="mb-4">Total Users: {allusers.length}</h1>
          <div className="w-full h-[70vh]  grid grid-cols-12 gap-3 overflow-y-scroll justify-center items-center">
            {allusers.map((user) => {
              return (
                <div
                  onMouseEnter={() => setHoveredUserId(user._id)}
                  onMouseLeave={() => setHoveredUserId(null)}
                  key={user._id}
                  className="relative w-full h-[200px] md:h-[200px] lg:h-[200px] mt-5 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 bg-white hover:bg-blue-100 cursor-pointer   overflow-hidden p-2 rounded-xl"
                >
                  {hoveredUserId !== user._id && (
                    <div className=" w-full h-[1vh] bg-red-800 rounded-xl relative -top-3"></div>
                  )}
                  {hoveredUserId === user._id && (
                    <div className="absolute top-[-2px] left-0 w-full p-2 flex justify-between bg-white rounded-lg shadow-lg z-10">
                      <p
                        className={`${
                          user.status === "Active"
                            ? "text-green-700"
                            : "text-red-800"
                        }`}
                      >
                        {user.status}
                      </p>
                      <div className="flex gap-3">
                        <p
                          onClick={() => handleEdit(user._id)}
                          className="cursor-pointer text-blue-500"
                        >
                          Edit
                        </p>
                        <p
                           onClick={()=> handleOpenDelete(user._id)}
                          className="cursor-pointer text-red-800"
                        >
                          Del
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-[50px] h-[50px] bg-cyan-400 rounded-full"></div>
                    <h2 className="text-gray-500 text-[32px] font-bold ">
                      {user.name}
                    </h2>
                    <p className="text-gray-500 text-[12px] font-bold mb-2">
                      {user.email}
                    </p>
                    <div className="flex gap-2 ">
                      <p className="w-[70px] h-[30px] bg-blue-200 rounded-lg border border-blue-500  text-blue-600 flex justify-center items-center text-blue-500 text-[16px] font-bold">
                        {user.role}
                      </p>
                      <p className="w-[70px] h-[30px] bg-blue-200 rounded-lg border border-blue-500  text-blue-600 flex justify-center items-center text-blue-500 text-[16px] font-bold">
                        {user.status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full h-auto">
          <h1 className="mb-4">Total Users: {allusers.length}</h1>
          <div className="w-full h-[70vh] flex flex-col gap-3 overflow-y-scroll ">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left">Name</th>
                  <th className="px-4 py-2 border-b text-left">Email</th>
                  <th className="px-4 py-2 border-b text-left">Role</th>
                  <th className="px-4 py-2 border-b text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {allusers.map((user) => {
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-white hover:text-black cursor-pointer"
                      onMouseEnter={() => setHoveredUserId(user._id)}
                      onMouseLeave={() => setHoveredUserId(null)}
                    >
                      <td className="px-4 py-2 border-b">{user.name}</td>
                      <td className="px-4 py-2 border-b">{user.email}</td>
                      <td className="px-4 py-2 border-b">{user.role}</td>
                      <td className="px-4 py-2 border-b">{user.createdAt}</td>
                      <td
                        className="px-4 py-2 border-b text-blue-500"
                        onClick={() => handleEdit(user._id)}
                      >
                        Edit
                      </td>
                      <td
                        className="px-4 py-2 border-b text-red-800"
                        onClick={()=> handleOpenDelete(user._id)}
                      >
                        Delete
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;
