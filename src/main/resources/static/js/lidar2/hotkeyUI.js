const hotkeyUI = `
<table id="hotkeyTable">
    <colgroup>
        <col width="90px">
        <col width="*">
    </colgroup>
    
    <tr>
        <td>
            <div class="hotkey">Space</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Set default view for all camera </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">1</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Deselect </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">2</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Add Cube </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">3</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Add Cylinder </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">4</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Add object for only rect </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">5</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Choose Object </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">6</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Find Pcd Points </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">7</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Search PopUp show/hide </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">8</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Review or Inspect PopUp show/hide </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">9</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Help PopUp show/hide </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">W</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move object - Up </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">S</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move object - Down </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">A</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move object - Left </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">D</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move object - Right </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Z</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move object - Front </div>
        </td>
    </tr>
     <tr>
        <td>
            <div class="hotkey">X</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move object - Back </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Q</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Rotate object - Left (z-axis) </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">E</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Rotate object - Right (z-axis) </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">T</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move SVG Rect - Up </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">G</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move SVG Rect - Down </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move SVG Rect - Left </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">H</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Move SVG Rect - Right </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">LEFT ARROW</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Rotate object - counterclockwise 90 degrees </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Right ARROW</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Rotate object - clockwise 90 degrees </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Shift</div> + <div class="hotkey">W</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Larger - Top </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Shift</div> + <div class="hotkey">S</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Larger - Bottom </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Shift</div> + <div class="hotkey">A</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Larger - Left </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Shift</div> + <div class="hotkey">D</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Larger - Right </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Shift</div> + <div class="hotkey">Z</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Larger - Front </div>
        </td>
    </tr>
    <tr>
    <td>
        <div class="hotkey">Shift</div> + <div class="hotkey">X</div>
    </td>
    <td>
        <div class="hotkeyDesc"> Object Larger - back </div>
    </td>
</tr>
    <tr>
        <td>
            <div class="hotkey">Alt</div> + <div class="hotkey">W</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Smaller - Top </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Alt</div> + <div class="hotkey">S</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Smaller - Bottom </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Alt</div> + <div class="hotkey">A</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Smaller - Left </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Alt</div> + <div class="hotkey">D</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Smaller - Right </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Alt</div> + <div class="hotkey">Z</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Smaller - Front </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Alt</div> + <div class="hotkey">X</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Smaller - Back </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Shift</div> + <div class="hotkey">Q</div>
        </td>
        <td>
            <div class="hotkeyDesc">  Rotate object - left (x-axis) </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Shift</div> + <div class="hotkey">E</div>
        </td>
        <td>
            <div class="hotkeyDesc">  Rotate object - right (x-axis) </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Ctrl</div> + <div class="hotkey">C</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Copy Object </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Ctrl</div> + <div class="hotkey">Shift</div> + <div class="hotkey">C</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Copy All Objects </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">Ctrl</div> + <div class="hotkey">V</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Paste Copied Objects </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">TAB</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Change Next Object list  </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">DELETE</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Delete Object  </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">PAGEDOWN</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Change Next PCD list  </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">PAGEUP</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Change Prev PCD list  </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F1</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Guide Popup show/hide </div>
        </td>
    </tr>
     <tr>
        <td>
            <div class="hotkey">F2</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Object Spheres show/hide </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F3</div>
        </td>
        <td>
            <div class="hotkeyDesc"> All 2D Rects show/hide </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F4</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Selected Cuboids show/hide </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F5</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Refresh Tool </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F6</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Make Rects Automatically </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F7</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Make Rects Manually </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">F8</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Change RGB Camera </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="hotkey">ENTER</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Focus Out Input/Textarea  </div>
        </td>
    </tr>
     <tr>
        <td>
            <div class="hotkey">ESC</div>
        </td>
        <td>
            <div class="hotkeyDesc"> Eraser Input/Textarea Text </div>
        </td>
    </tr>
</table>
`;

export { hotkeyUI };