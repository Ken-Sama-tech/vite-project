const throttle = (cb, delay = 1000) => {
    let lastCall = 0;

    return (...args) => {
        const now = Date.now();

        if (now - lastCall >= delay) {
            lastCall = now;
            cb(...args);
        }
    };
};

export default throttle;