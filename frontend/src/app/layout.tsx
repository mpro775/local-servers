"use client";

import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";
import { AuthProvider } from "../contexts/AuthContext";
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body dir="rtl">
        <ApolloProvider client={client}>
          <AuthProvider>
             <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
            <NextUIProvider>

              <Navbar />

            {children}
            <Footer/>
            </NextUIProvider>
          </AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
