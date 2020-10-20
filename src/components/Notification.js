import React from 'react';

export const Register = () => {
    Notification.requestPermission().then(function (status) {
        if (status === 'denied') {
            // console.log('[Notification.requestPermission] The user has blocked notifications.');
        } else if (status === 'granted') {
           // console.log(Notification)
            // console.log('[Notification.requestPermission] Initializing service worker.');
            //initialiseServiceWorker();
        }
    });

    return null;
}