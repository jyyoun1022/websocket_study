const settingUI = `
<table>
    <colgroup>
        <col width="140px">
        <col width="*">
    </colgroup>
    <!-- center point visible -->
    <tr>
        <td>
            <div id="centerPointVisible" class="radioTitle">Center Point Visible </div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="vcp1" name="vcp" value="showCP" checked> 
                    <label for="vcp1">show</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="vcp2" name="vcp" value="hiddenCP"> 
                    <label for="vcp2">hide</label> 
                </div>
            </div>
        </td>
    </tr>
     <!-- labels visible -->
    <tr>
        <td>
            <div id="labelsVisible" class="radioTitle">Labels Visible </div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="vlb1" name="vlb" value="showLB" checked> 
                    <label for="vlb1">show</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="vlb2" name="vlb" value="hiddenLB"> 
                    <label for="vlb2">hide</label> 
                </div>
            </div>
        </td>
    </tr>
    <!-- cuboid sphere visible -->
    <tr>
        <td>
            <div id="ObejctSphereVisible" class="radioTitle">Object Sphere Visible </div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="vcs1" name="vcs" value="showCS" checked> 
                    <label for="vcs1">show</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="vcs2" name="vcs" value="hiddenCS"> 
                    <label for="vcs2">hide</label> 
                </div>
            </div>
        </td>
    </tr>
    <!-- Point Cloud visible -->
    <tr>
        <td>
            <div id="PCDVisible" class="radioTitle">Point Cloud Visible </div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="vpc1" name="vpc" value="showPC" checked> 
                    <label for="vpc1">show</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="vpc2" name="vpc" value="hiddenPC"> 
                    <label for="vpc2">hide</label> 
                </div>
            </div>
        </td>
    </tr>
    <!-- Point Cloud Size -->
    <tr>
        <td>
            <div id="PCDCounter" class="sliderTitle">Point Cloud Size (<p></p>)</div>
        </td>
        <td>
            <div id="PCDSlider" class="sliderBody"></div>
        </td>
    </tr>
     <!-- Point Cloud origin color -->
    <tr>
        <td>
            <div id="PcdOriginColor" class="sliderTitle">PCD Origin Color</div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="pcc1" name="pcc" value="originPCC" checked> 
                    <label for="pcc1">origin</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="pcc2" name="pcc" value="customPCC"> 
                    <label for="pcc2">custom</label> 
                </div>
            </div>
        </td>
    </tr>
    <!-- PCD Custom Color -->
    <tr>
        <td>
            <div id="PCDColor" class="radioTitle">PCD Custom Color</div>
        </td>
        <td>
             <div class="colorPicker">
                <input type="color" id="PCP">
             </div>
        </td>
    </tr>
    <!-- Wireframe visible -->
    <tr>
        <td>
            <div id="wireframeVisible" class="radioTitle">Wireframe Visible</div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="vwf1" name="vwf" value="showWF" checked> 
                    <label for="vwf1">show</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="vwf2" name="vwf" value="hiddenWF"> 
                    <label for="vwf2">hide</label> 
                </div>
            </div>
        </td>
    </tr>
    <!-- Wireframe color -->
    <tr>
        <td>
            <div id="wireframeColor" class="radioTitle">Wireframe Color</div>
        </td>
        <td>
            <div class="colorPicker">
                <input type="color" id="WCP">
            </div>
        </td>
    </tr>
    <!-- Front Cuboid visible -->
    <tr>
        <td>
            <div id="frontCuboidVisible" class="radioTitle">Front Cuboid Visible</div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="vfc1" name="vfc" value="showFC" checked> 
                    <label for="vfc1">show</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="vfc2" name="vfc" value="hiddenFC"> 
                    <label for="vfc2">hide</label> 
                </div>
            </div>
        </td>
    </tr>
    <!-- Front Cuboid Color -->
    <tr>
        <td>
            <div id="frontCuboidColor" class="radioTitle">Front Cuboid Color</div>
        </td>
        <td>
            <div class="colorPicker">
                <input type="color" id="FCP">
            </div>
        </td>
    </tr>
    <!-- opacity on Lidar -->
    <tr>
        <td>
            <div id="OPLCounter" class="sliderTitle">Opacity on Lidar (<p></p>)</div>
        </td>
        <td>
            <div id="OPLSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- Size Ratio-->
    <tr>
        <td>
            <div id="SRCounter" class="sliderTitle">Size Ratio (<p></p>)</div>
        </td>
        <td>
            <div id="SRSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- Move Ratio -->
    <tr>
        <td>
            <div id="MRCounter" class="sliderTitle">Move Ratio (<p></p>)</div>
        </td>
        <td>
            <div id="MRSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- Rotation Ratio -->
    <tr>
        <td>
            <div id="RRCounter" class="sliderTitle">Rotation Ratio (<p></p>)</div>
        </td>
        <td>
            <div id="RRSlider" class="sliderBody"></div>
        </td>
    </tr>
     <!-- SVG Move Ratio -->
    <tr>
        <td>
            <div id="SMRCounter" class="sliderTitle">SVG Move Ratio (<p></p>)</div>
        </td>
        <td>
            <div id="SMRSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- Visible Plane -->
    <tr>
        <td>
            <div id="planeVisible" class="radioTitle">Plane Visible</div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="vpl1" name="vpl" value="showPL"> 
                    <label for="vpl1">show</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="vpl2" name="vpl" value="hiddenPL" checked> 
                    <label for="vpl2">hide</label> 
                </div>
            </div>
        </td>
    </tr>
     <!-- Plane Shape-->
    <tr>
        <td>
            <div id="planeShape" class="radioTitle">Plane Shape</div>
        </td>
        <td>
            <div class="radioWrap">
                <div class="modifyRadio">
                    <input type="radio" id="pls1" name="pls" value="squarePL" checked> 
                    <label for="pls1">square</label> 
                </div>
                <div class="modifyRadio">
                    <input type="radio" id="pls2" name="pls" value="circlePL"> 
                    <label for="pls2">circle</label> 
                </div>
            </div>
        </td>
    </tr>
    <!-- Plane PositionZ -->
    <tr>
        <td>
            <div class="flexWrapper">
                    <!--<div id="PPCounter" class="sliderTitle">P. PosZ (<p></p> m)</div>-->
                    <div class="sliderTitle"> <span id="PPCounter">P. PosZ</span>  ( <input class="settingInput" type="text" id="planePosInput" maxlength="4"> m)</div>
                <div>
                    <span class="sliderBtn" id="btnPlanePosPlus">+</span> 
                    <span class="sliderBtn" id="btnPlanePosMinus">-</span>
                </div>     
            </div>
        </td>
        <td>
            <div id="PPSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- Plane Size -->
    <tr>
        <td>
            <div class="flexWrapper">
                    <!--<div id="PSCounter" class="sliderTitle">P. Size (<p></p> m)</div>-->
                    <div class="sliderTitle"> <span id="PSCounter">P. Size</span>  ( <input class="settingInput" type="text" id="planeSizeInput" maxlength="4"> m)</div>
                <div>
                    <span class="sliderBtn" id="btnPlaneSizePlus">+</span> 
                    <span class="sliderBtn" id="btnPlaneSizeMinus">-</span>
                </div>     
            </div>
        </td>
        <td>
            <div id="PSSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- Plane Color -->
    <tr>
        <td>
            <div id="planeColor" class="radioTitle">Plane Color</div>
        </td>
        <td>
            <div class="colorPicker">
                <input type="color" id="PLCP">
            </div>
        </td>
    </tr>
    <!-- image brightness -->
    <tr>
        <td>
            <div id="IBCounter" class="sliderTitle">Image Brightness (<p></p> %)</div>
        </td>
        <td>
            <div id="IBSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- image contrast -->
    <tr>
        <td>
            <div id="ICCounter" class="sliderTitle">Image Contrast (<p></p> %)</div>
        </td>
        <td>
            <div id="ICSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- RGB Opacity -->
    <tr>
        <td>
            <div id="ROCounter" class="sliderTitle">RGB Opacity (<p></p>)</div>
        </td>
        <td>
            <div id="ROSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- cuboid line width -->
    <tr>
        <td>
            <div id="CLWCounter" class="sliderTitle">cuboid line width (<p></p>)</div>
        </td>
        <td>
            <div id="CLWSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- rect line width -->
    <tr>
        <td>
            <div id="RLWCounter" class="sliderTitle">rect line width (<p></p>)</div>
        </td>
        <td>
            <div id="RLWSlider" class="sliderBody"></div>
        </td>
    </tr>
    <!-- rect circle size -->
    <tr>
        <td>
            <div id="RCSCounter" class="sliderTitle">rect circle size (<p></p>)</div>
        </td>
        <td>
            <div id="RCSSlider" class="sliderBody"></div>
        </td>
    </tr>
<!--    <tr>-->
<!--        <td>-->
<!--            <div id="imageServerVisible" class="radioTitle">Image Server Url</div>-->
<!--        </td>-->
<!--        <td>-->
<!--            <div class="radioWrap">-->
<!--                <div class="modifyRadio">-->
<!--                    <input type="radio" id="isu1" name="default" value="defaultIS" checked> -->
<!--                    <label for="isu1">Default</label> -->
<!--                </div>-->
<!--                <div class="modifyRadio">-->
<!--                    <input type="radio" id="isu2" name="default" value="edgeIS"> -->
<!--                    <label for="isu2">Edge</label> -->
<!--                </div>-->
<!--            </div>-->
<!--        </td>-->
<!--    </tr>-->
</table>
`;

export { settingUI };