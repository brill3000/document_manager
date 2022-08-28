import * as React from 'react'
import Lottie from 'react-lottie';
import loading from './lottie/folder_loading_animation';
import notFound from './lottie/folder_empty_animation';
import error from './lottie/error_animation.json';



const FolderLoader = ({ height, width }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loading,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div>
            <Lottie
                options={defaultOptions}
                height={height ?? 400}
                width={width ?? 400}
            />
        </div>
    )
}



const FolderEmpty = ({ height, width }) => {

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: notFound,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div>
            <Lottie
                options={defaultOptions}
                height={height ?? 400}
                width={width ?? 400}
            />
        </div>
    )
}

const Error = ({ height, width }) => {

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: error,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div>
            <Lottie
                options={defaultOptions}
                height={height ?? 400}
                width={width ?? 400}
            />
        </div>
    )
}

export { FolderLoader, FolderEmpty, Error }