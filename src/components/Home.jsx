
import Navbar from './Navbar';
import { useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { manageState, userState } from '../../store/userAtom';
import Manage from './Manage';



function Home() {
  const nameRef = useRef();
  const emailRef = useRef();
  const emailLoginRef = useRef();
  const passwordRef = useRef();
  const passwordLoginRef = useRef();
  const [step, setStep] = useState(0);
  const [user, setUser] = useRecoilState(userState);
  const [manage, setManage] = useRecoilState(manageState);

  const handleAuth = (e,val) => {
    e.preventDefault();

    if(val === "register"){
        setManage(false)
      setStep(1)
    }else if(val === "login"){
        setManage(false)
      setStep(2)
    }else{
        setManage(false)
      setStep(0)
    }
  }

  const handleLogin = async(e) => {
    e.preventDefault();
    const email = emailLoginRef.current.value;
    const password = passwordLoginRef.current.value;

    // Simulate API call to register the user
    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/signIn", 
        {
          email, password
        })
         // Update Recoil state
    setUser({
      id: res.data.user._id,
      name: res.data.user.name || '', // Assuming the API returns the name
      email: res.data.user.email,
      role: res.data.user.role,
      status: res.data.user.status,
      token: res.data.token,
    });

        await localStorage.setItem("token", res.data.token)
        toast("user logged in successfully");
        setStep(0)
    } catch (error) {
      toast("Error: " + error.message)
    }
  }


  const handleRegister = async(e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Simulate API call to register the user
    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/signUp", 
        {
          name, email, password
        })
        setUser({
          id: res.data.user._id,
          name: res.data.user.name || '', // Assuming the API returns the name
          email: res.data.user.email,
          role: res.data.user.role,
          status: res.data.user.status,
          token: res.data.token,
        });

        await localStorage.setItem("token", res.data.token)
        toast("user created successfully");
        setStep(0)
    } catch (error) {
      if(error.status === 400){
        toast("Error: " + "user already present in db")
      }
    }
    // Here you would typically send the data to your backend API
    console.log({ name, email, password });
  }
  const handleLogOut = async() => {
    setUser({ id: null, name: "", email: "", role: "", status: "", token: null });
    await localStorage.removeItem('token');
    setManage(false)
    navigate("/")
  };
  return (
    <div  className='w-full h-screen  bg-cover bg-center bg-stone-900 '  >
    <Navbar onClick={handleAuth}/>

     {/* Conditional Rendering based on step */}
      <div className='w-full flex flex-col justify-center items-center'>
     {step === 1 ? (
       <div className="w-[350px] h-[80vh] text-center text-white mt-20">
          <h1 className='text-[32px]'>Register</h1>
          <form onSubmit={(e)=> handleRegister(e)}>
            <input ref={nameRef} type="text" placeholder="Username" className="mt-5 p-2 w-full rounded-md text-black" />
            <input ref={emailRef} type="email" placeholder="Email" className="mt-5 p-2 w-full rounded-md text-black" />
            <input ref={passwordRef} type="password" placeholder="Password" className="mt-5 p-2 w-full rounded-md text-black" />
            <button type="submit" className="mt-5 p-2 w-full rounded-md bg-blue-500 text-white">Register</button>
          </form>
        </div>
      ) : step === 2 ? (
        <div className="w-[350px] h-[80vh] text-center text-white mt-20">
          <h1 className='text-[32px]'>Login</h1>
          <form onSubmit={(e)=> handleLogin(e)}>
            <input ref={emailLoginRef} type="email" placeholder="Email" className="mt-5 p-2 w-full rounded-md text-black" />
            <input ref={passwordLoginRef} type="password" placeholder="Password" className="mt-5 p-2 w-full rounded-md text-black" />
            <button type="submit" className="mt-5 p-2 w-full rounded-md bg-blue-500 text-white">Login</button>
          </form>
        </div>
      ) : null}
      </div>

      {
        // Show user details if logged in
        manage ? (
            <div className='w-full h-[80%]'>
          <Manage/>
            </div>
        ):(
          <div className='w-full h-[80%] flex flex-col justify-center items-center '>
            <h1 className='text-[50px] font-bold text-white'>Welcome <span className='text-orange-300'>{user.name}</span></h1>
            <p className='w-[50%] text-center text-white text-[30px]'>You can try the admin feature by these credentials</p>
            <h1 className='w-[50%] text-center text-gray-600 text-[30px]' >email: admin@gmail.com</h1>
            <p className='w-[50%] text-center text-gray-600 text-[30px]'>password: 123</p>
            <button onClick={handleLogOut} className='mt-5 p-2 w-[70px] rounded-md bg-blue-500 text-white'>Logout</button>
          </div>
        )
      }

      

      <Toaster/>
    </div>

  );
}

export default Home;
