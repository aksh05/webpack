
export const removeDrawerAction = (route) => {
    return route.replace(/[&?]action=drawerOpen/g, "");
}
