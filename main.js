const SCALE_FACTOR = 1.02;
const PAN_SPEED = 5;
const QUALITIES = {
    FULL : 1,
    FLAWED : 2,
    DEFECTED : 3,
};
const MARKER_RADIUS = 10;

function main(){
    // Locate HTML elements
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");

    const fileElement = document.getElementById("file");
    const invertControlsElement = document.getElementById("invert");

    // Set up state
    const state = {
        file : null,
        cameraPos : {x : 0, y : 0},
        scale : 1.0,
        invertControls : 1,
        markers : [],
    };

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1000, 1000);

    // Add event listeners
    fileElement.addEventListener("change", (e) => handleFiles(e, state));
    invertControlsElement.addEventListener("change", (e) => state.invertControls = (e.target.checked ? -1 : 1));

    // Initialize Canvas Interaction Client
    const cic = new CanvasInteractionClient(c);

    update(c, ctx, cic, state);
}

function update(c, ctx, cic, state){
    // User interaction
    const currentPanSpeed = PAN_SPEED * state.scale * state.invertControls;
    if(cic.getKey("a")) state.cameraPos.x -= currentPanSpeed;
    if(cic.getKey("d")) state.cameraPos.x += currentPanSpeed;
    if(cic.getKey("w")) state.cameraPos.y -= currentPanSpeed;
    if(cic.getKey("s")) state.cameraPos.y += currentPanSpeed;

    if(cic.getKey("e")) state.scale *= SCALE_FACTOR;
    if(cic.getKey("q")) state.scale /= SCALE_FACTOR;

    if(state.file !== null){
        for(let [_, value] of Object.entries(QUALITIES)){
            if(cic.getMouseButtonDown(value) || cic.getKeyUp(value.toString())){
                let x = (cic.mouseX - state.cameraPos.x) / (state.file.width * state.scale);
                let y = (cic.mouseY - state.cameraPos.y) / (state.file.height * state.scale);

                if(x >= 0 && x <= 1 && y >= 0 && y <= 1){
                state.markers.push({x : x, y : y, quality : value});
                }
            }
        }
    }

    // Render
    ctx.clearRect(0, 0, c.width, c.height);
    if(state.file !== null){
        ctx.drawImage(state.file, state.cameraPos.x, state.cameraPos.y, state.file.width * state.scale, state.file.height * state.scale);
        for(let marker of state.markers){
            switch(marker.quality){
                case QUALITIES.FULL:
                    ctx.fillStyle = "green";
                    break;
                case QUALITIES.FLAWED:
                    ctx.fillStyle = "yellow";
                    break;
                case QUALITIES.DEFECTED:
                    ctx.fillStyle = "red";
                    break;
            }
            ctx.fillRect(
                state.cameraPos.x + marker.x * state.scale * state.file.width - MARKER_RADIUS,
                state.cameraPos.y + marker.y * state.scale * state.file.height - MARKER_RADIUS,
                MARKER_RADIUS * 2,
                MARKER_RADIUS * 2
            );
        }
    }

    // Update data
    document.getElementById("full").textContent = "Full: " + state.markers.filter((marker) => marker.quality == QUALITIES.FULL).length;
    document.getElementById("flawed").textContent = "Flawed: " + state.markers.filter((marker) => marker.quality == QUALITIES.FLAWED).length;
    document.getElementById("defected").textContent = "Defected: " + state.markers.filter((marker) => marker.quality == QUALITIES.DEFECTED).length;

    cic.onFrameUpdate();
    window.requestAnimationFrame(() => update(c, ctx, cic, state));
}

function handleFiles(e, state){
    let image = document.createElement("img");
    image.src = URL.createObjectURL(e.target.files[0]);
    image.onload = function() {
        state.file = image;
    }
}

main();