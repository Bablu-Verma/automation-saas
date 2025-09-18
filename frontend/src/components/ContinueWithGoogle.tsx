"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";

import axios from "axios";

import { login } from "@/redux-store/slice/userSlice";
import { firebase_auth, google_provider } from "@/conf/firebase";
import { google_login_api } from "@/api";
import { FcGoogle } from "react-icons/fc";


type WithGoogleProps = {
  title: string;
};

const WithGoogle: React.FC<WithGoogleProps> = ({title}) => {

 const dispatch = useDispatch()


 const loginWithGoogle = async () => {

    try {
        const result = await signInWithPopup(firebase_auth, google_provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // console.log("User idToken:", idToken);


        const { data } = await axios.post(
            google_login_api,
            {
                google_token: idToken
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // console.log("login responce data",data)
    
        dispatch(login({ user: data.user, token: data.token }));

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);

    } catch (error) {
        console.error("Login error", error);
    }
};

    return (
         <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-2 rounded-xl bg-white text-gray-800 font-semibold shadow hover:shadow-lg transition"
        >
          <FcGoogle className="text-xl" />
          {title} with Google
        </button>
       
    );
};

export default WithGoogle;
