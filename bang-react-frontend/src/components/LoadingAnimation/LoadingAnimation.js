import React from 'react'
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

const LoadingAnimation = ({isLoading}) => {
  return (
    <>
        <div className='home flex h-screen'>
            <div className="m-auto">
                <ClimbingBoxLoader 
                color={"#F37A24"} 
                loading={isLoading}
                size={50} />
            </div>
        </div>
    </>
  )
}

export default LoadingAnimation