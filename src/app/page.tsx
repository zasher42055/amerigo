"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step1 from "./Step1";
import clsx from "clsx";

export interface IFormInput {
  origin_destination: {
    transport_car_from: string;
    transport_car_to: string;
  };
  vehicle_details: {
    vehicle_type: { name: string; id: string };
    year: { name: string; id: number } | string;
    company: { make: string } | string;
    vehicle_name:
      | {
          vehicle_id: string;
          type: string;
          year: number;
          make: string;
          model: string;
          original_model: string;
        }
      | string;
  };
  shipment_details: {
    name: string;
    email: string;
    preferred_date: Date | null | [Date | null, Date | null];
    phone: string;
  };
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  // {
  // defaultValues: {
  //   location: "",
  // },
  // }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      const responseForAddRecordImage: any = await axios.post(
        "./api/send_email",
        {
          data,
        }
      );
      console.log(responseForAddRecordImage);

      setSuccessMsg("Submitted!");

      setTimeout(() => {
        window.location.assign("https://amerigoautotransport.com/thank-you/");
        reset();
      }, 50);
      // notify();
    } catch (err) {
      console.log(err);
      setErrMsg("Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg("");
        setErrMsg("");
      }, 3000);
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Step1 errors={errors} watch={watch} control={control} />
        <Step2
          errors={errors}
          register={register}
          watch={watch}
          setValue={setValue}
          clearErrors={clearErrors}
          control={control}
        />
        <Step3
          errors={errors}
          register={register}
          watch={watch}
          setValue={setValue}
          clearErrors={clearErrors}
          control={control}
          setError={setError}
        />
        <button
          type="submit"
          className={clsx(
            "mt-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-sm font-medium relative block w-full group items-center justify-center px-3.5 py-2 cursor-pointer border-b-4 border-l-2 transition-colors ease-out duration-50",
            successMsg &&
              "bg-green-500 text-white border-green-500 border-b-4 border-l-2",
            errMsg &&
              "bg-red-500 border-red-500 text-white border-b-4 border-l-2 ",
            !successMsg &&
              !errMsg &&
              "active:border-[#042434] active:shadow-none shadow-lg bg-gradient-to-tr from-[#042434] to-[#052f44] border-[#063a54] text-white "
          )}
        >
          <span className="relative">
            {(() => {
              if (loading) {
                return "Sending Quote...";
              }
              if (successMsg) {
                return successMsg;
              }
              if (errMsg) {
                return errMsg;
              }

              return "Submit";
            })()}
          </span>
        </button>
      </form>
    </div>
  );
}
