import { Oval } from "react-loader-spinner"

const Spinner = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Oval
                visible={true}
                height="50"
                width="50"
                color="#011627"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                strokeWidth="6"
            />

        </div>
    )
}

export default Spinner