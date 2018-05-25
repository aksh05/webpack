export default () => {
    return $.ajax("../app/tuples.json", { dataType: "json" });
}
