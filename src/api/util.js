import {Toast} from "bootstrap";

export const toastShowWarning = (element) => {
    let toast = new Toast(element, {
        delay: 2000
    });
    toast.show()
}

export const transferUnit = (time, div) => {
    let u = new Map();
    u.set(1000, "ms");
    u.set(1024, "KB");
    u.set(1000000, "s");
    u.set(1048576, "MB");
    let v = time / div;
    if (v > div) {
        return (time / div / div).toFixed(1) + u.get(div * div);
    } else {
        return v.toFixed(1) + u.get(div);
    }
};
