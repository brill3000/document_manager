import * as React from 'react';
import Lottie from 'react-lottie';
import loading from './lottie/folder_loading_animation';
import notFound from './lottie/folder_empty_animation';
import error from './lottie/error_animation.json';
import mail from './lottie/mail.json';
import googleLoader from './lottie/googleLoader.json';
import sending from './lottie/sending.json';
import conversation from './lottie/conversation.json';
import notfoundjson from './lottie/404.json';

const FolderLoader = ({ height, width }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loading,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};

const FolderEmpty = ({ height, width }) => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: notFound,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};

const Error = ({ height, width }) => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: error,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};

const MailLoader = ({ height, width, loop }) => {
    const defaultOptions = {
        loop: loop ?? false,
        autoplay: true,
        animationData: mail,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};

const GoogleLoader = ({ height, width, loop }) => {
    const defaultOptions = {
        loop: loop ?? false,
        autoplay: true,
        animationData: googleLoader,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};
const Sending = ({ height, width, loop }) => {
    const defaultOptions = {
        loop: loop ?? false,
        autoplay: true,
        animationData: sending,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};

const Conversation = ({ height, width, loop }) => {
    const defaultOptions = {
        loop: loop ?? false,
        autoplay: true,
        animationData: conversation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};
const NotFoundLoader = ({ height, width, loop }) => {
    const defaultOptions = {
        loop: loop ?? false,
        autoplay: true,
        animationData: notfoundjson,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={height ?? 400} width={width ?? 400} />
        </div>
    );
};

export { FolderLoader, FolderEmpty, Error, MailLoader, GoogleLoader, Sending, Conversation, NotFoundLoader };
