/* 
 * CanvasInteractionClient
 * (c) Jacob Thomas
 *
 * Usage:
 *     Constructor: new CanvasInteractionClient(canvas, disableDefaultKeyEvents = ["ArrowUp", "ArrowDown", " "], disableMouseRightClicks = true);
 *         canvas: the HTMLCanvasElement for the interactions to occur with.
 *         disableDefaultKeyEvents: any keys to prevent the default event for while focused on the canvas (for example, space will by default scroll down)
 *         disableMouseRightClicks: whether or not to prevent the right click menu on the canvas
 *     Properties:
 *         mouseX: mouse's X position, updated every time the mouse moves
 *         mouseY: mouse's Y position, updated every time the mouse moves
 *         mouseButtons: which mouse buttons (Left: 1, Middle: 2, Right: 3) are currently held
 *         mouseButtonsDown: which mouse buttons (Left: 1, Middle: 2, Right: 3) are pressed this frame
 *         mouseButtonsUp: which mouse buttons (Left: 1, Middle: 2, Right: 3) are released this frame
 *         keys: which keys are currently held
 *         keysDown: which keys are pressed this frame
 *         keysUp: which keys are released this frame
 *     Methods:
 *         getMouseButton(button): returns true during any frame the user holds the specified mouse button (1, 2, 3)
 *         getMouseButtonDown(button): returns true during the frame the user presses the specified mouse button (1, 2, 3)
 *         getMouseButtonUp(button): returns true during the frame the user releases the specified mouse button (1, 2, 3)
 *         getKey(key): returns true during any frame the user holds the specified key
 *         getKeyDown(key): returns true during the frame the user presses the specified key
 *         getKeyUp(key): returns true during the frame the user releases the specified key
 *         onFrameUpdate(): IMPORTANT: must be called every frame of your update function.
 */

class CanvasInteractionClient {
	constructor(canvas, disableDefaultKeyEvents = ["ArrowUp", "ArrowDown", " "], disableMouseRightClicks = true){
		this.c = canvas;
		this.c.interactionClient = this;
		
		this.disableDefaultKeyEvents = disableDefaultKeyEvents;
		if(disableMouseRightClicks){
			this.c.oncontextmenu = () => false;
		}
		
		this.mouseX = 0; //Mouse X Position
		this.mouseY = 0; //Mouse Y Position
		this.mouseButtons = {}; //Multi-Frame Mouse Hold
		this.mouseButtonsDown = {}; //Single Frame Mouse Press
		this.mouseButtonsUp = {}; //Singe Frame Mouse Release
		
		this.keys = {}; //Multi-Frame Key Hold
		this.keysDown = {}; //Single Frame Key Press
		this.keysUp = {}; //Single Frame Key Release
		
		document.addEventListener("mousemove", (e) => {
			this.updateMousePosition(e);
		});
		document.addEventListener("mousedown", (e) => {
			this.updateMousePosition(e);
			this.mouseButtons[e.which] = true;
			this.mouseButtonsDown[e.which] = true;
		});
		document.addEventListener("mouseup", (e) => {
			this.updateMousePosition(e);
			this.mouseButtons[e.which] = false;
			this.mouseButtonsUp[e.which] = true;
		});
		
		document.addEventListener("keydown", (e) => {
			if(this.disableDefaultKeyEvents.indexOf(e.key) != -1){
				e.preventDefault();
			}
			this.keys[e.key] = true;
			this.keysDown[e.key] = true;
		});
		document.addEventListener("keyup", (e) => {
			this.keys[e.key] = false;
			this.keysUp[e.key] = true;
		});
	}
	
	updateMousePosition(e){
		var cbounds = this.c.getBoundingClientRect();
		this.mouseX = Math.round(e.offsetX * (this.c.width / (cbounds.right - cbounds.left)));
		this.mouseY = Math.round(e.offsetY * (this.c.height / (cbounds.bottom - cbounds.top)));
	}
	
	onFrameUpdate(){
		for(var array of [this.mouseButtonsDown, this.mouseButtonsUp, this.keysDown, this.keysUp]){
			for(var item in array){
				array[item] = false;
			}
		}
	}
	
	getMouseButton = button => this.mouseButtons[button] ? true : false; //returns true during any frame the user holds the specified mouse button (1, 2, 3)
	getMouseButtonDown = button => this.mouseButtonsDown[button] ? true : false; //returns true during the frame the user presses the specified mouse button (1, 2, 3)
	getMouseButtonUp = button => this.mouseButtonsUp[button] ? true : false; //returns true during the frame the user releases the specified mouse button (1, 2, 3)
	
	getKey = key => this.keys[key] ? true : false; //returns true during any frame the user holds the specified key
	getKeyDown = key => this.keysDown[key] ? true : false; //returns true during the frame the user presses the specified key
	getKeyUp = key => this.keysUp[key] ? true : false; //returns true during the frame the user releases the specified key
}
