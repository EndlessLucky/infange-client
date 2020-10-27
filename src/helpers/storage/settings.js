export default {
    get activeID() {
        return window.localStorage.getItem('activeID');
    },
    set activeID(id) {
        window.localStorage.setItem('activeID', id);
    },
}