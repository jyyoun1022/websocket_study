import * as THREE from './build/three.module.js';

const screen = {
    scene                   : null,
    renderer                : null,
    canvas                  : null,
    stats                   : null,
    labelRenderer           : null
};

const settingData = {
    visibleCenterPoint      : null,
    visibleLabels           : null,
    visibleObjectSphere     : null,
    visiblePointCloud       : null,
    pcdSize                 : null,
    pcdColor                : null,
    showOriginPcdColor      : null,
    visibleWireFrame        : null,
    wireFrameColor          : null,
    visibleFrontCube        : null,
    frontCubeColor          : null,
    objectOpacity           : null,
    objectSizeRate          : null,
    objectMoveRate          : null,
    objectRotateRate        : null,
    visiblePlane            : null,
    planeShape              : null,
    planePosZ               : null,
    planeSize               : null,
    planeColor              : null,
    imageBrightness         : null,
    imageContrast           : null,
    RGBopacity              : null,
    cuboideLineWidth        : null,
    rectLineWidth           : null,
    rectCircleSize          : null,
    svgMoveRate             : null,
    // useEdgeServer           : null,
};

const defaultSettingData = {
    visibleCenterPoint      : true,
    visibleLabels           : true,
    visibleObjectSphere     : true,
    visiblePointCloud       : true,
    pcdSize                 : 1,
    pcdColor                : "#323232",
    showOriginPcdColor      : true,
    visibleWireFrame        : true,
    wireFrameColor          : "#ffffff",
    visibleFrontCube        : true,
    frontCubeColor          : "#00ff00",
    objectOpacity           : 0.2,
    objectSizeRate          : 0.08,
    objectMoveRate          : 0.09,
    objectRotateRate        : 0.04,
    visiblePlane            : false,
    planeShape              : "square",
    planePosZ               : -1.8,
    planeSize               : 150,
    planeColor              : "#3187AF",
    imageBrightness         : 100,
    imageContrast           : 100,
    RGBopacity              : 1,
    cuboideLineWidth        : 5,
    rectLineWidth           : 4,
    rectCircleSize          : 2.5,
    svgMoveRate             : 1,
    // useEdgeServer           : false,
};

const globalData = {
    isPageStart             : true,
    isResetPcdFileList      : false,
    pcdTarget               : null,
    pcdTargetName           : null,
    mainView                : 1,
    objectTarget            : null,
    objectTargetShape       : null,
    gutterTarget            : null,
    rgbCameraTarget         : null,
    frustumSize             : 10,
    ogCameraFar             : [5,5,4],
    objectListIndex         : 0,
    isMoveScreen            : true,
    isFindObject            : false,
    isMakeGuideBox          : false,
    allowAllEvents          : false,
    allowInputEvent         : false,
    isChangePcdList         : true,
    inputTextAreaTarget     : null,
    hasRGBCamera            : true,
    hasOriginPcdColor       : false,
    defaultClass            : { name: null, color: null, number: null, dimension: null },
    class                   : { name: null, color: null, number: null, dimension: null },
    objectAllVisibility     : true,
    svgAllVisibility        : false,
    changeAllClass          : false,
    permissionCode          : null,
    permissionName          : null,
    reqType                 : null,
    windowWidth             : null,
    windowHeight            : null,
    imageServerDefault      : null,
    imageServerURL          : null,
    staticServer            : null,
    workProcess             : null,
    needRgbRender           : true,
    objectShape             : null,
    currentPage             : 1,
    rgbCanvasParams         : {},
    pageParam               : {},
    saveData                : {
        projectId   : null,
        taskId  : null,
        workTicketId   : null,
        reqType     : null,
        objectList  : [],
        tagList     : []
    },
    failData                : {
        message     : null
    },
    NGData                  : {
        message     : null,
        errorCode   : []
    },
    searchData              : {},
    selectedObjects         : [],
    selectedSvgs            : [],
    copiedObjects           : {
        cuboides    :  [],
        svgs        :  []
    },
    timers                  : {},
    alerts                  : {
        findPointsAlert         : "Firstly, you should make a cuboide!",
        makeSvgAlert            : "Can not make a rect by auto, try it by manual!",
        deleteAllCuboideAlert   : "Do you want to delete cuboides?"
    },
    notices                 : {
        copySelectedObjects     : "You Copy Selected Objects!",
        copyAllObjects          : "You Copy All Objects!",
        noObjectsToCopy         : "There are no objects to copy!",
        noObjectsToSelect       : "There are no selected objects!"
    }
};

const cuboideData = {
    sort                    : null,
    way                     : null,
    value                   : null,
    iskeyboard              : false,
    onlyRect                : false,
    defaultSize             : { w: 2, h: 3, d: 2 },
    size                    : { w: null, h: null, d: null },
    // minSize                 : { w: 0.1, h: 0.1, d: 0.1 },
    minSize                 : { w: 0.01, h: 0.01, d: 0.01 },
    position                : { x: null, y: null, z: null },
    rotation                : { x: null, y: null, z: null }
};

const cylinderData = {
    sort                    : null,
    way                     : null,
    value                   : null,
    iskeyboard              : false,
    onlyRect                : false,
    defaultSize             : { t: 2, b: 2, h: 2 },
    size                    : { t: null, b: null, h: null },
    minSize                 : { t: 0.1, b: 0.1, h: 0.1 },
    position                : { x: null, y: null, z: null },
    rotation                : { x: null, y: null, z: null }
};

const svgData = {
    rectMinSize             : new THREE.Vector2(),
    targetSvg               : null,
    targetCircle            : null,
    isImageMove             : false,
    isSvgMove               : false,
    isSvgEdit               : false,
    isAreaDrag              : false,
    mousePos                : new THREE.Vector2(),
    mousePrePos             : new THREE.Vector2(),
    svgMove                 : new THREE.Vector2(),
    calcSvgSpace            : new THREE.Vector2(),
    zoomCurrent             : 1,
    zoomBefore              : 1,
    zoomMax                 : 50,
    zoomMin                 : 1,
    defaultRect             : { x:0, y:0, w:1, h:1, isVisible: false },
    areaRect                : { startPosition: null, endPosition: null, rect: null }
}

const events = {
    guideBoxMouseMove       : null,
    guideBoxMouseClick      : null,
    gutterMouseMove         : null,
    gutterMouseDown         : null,
    gutterMouseUp           : null,
    svgMouseWheel           : null,
    svgMouseMove            : null,
    svgMouseUp              : null,
    svgMouseDown            : null,
    svgMouseOver            : null,
    svgMouseOut             : null,
    findObjectMouseMove     : null,
    findObjectMouseClick    : null,
    childviewMouseDown      : [],
    childviewMouseWheel     : [],
    childviewMouseUp        : null,
    childviewMouseMove      : null,
    alertConfirmClick       : null,
    alertCancelClick        : null,
    popUpMouseMove          : null,
    popUpMouseDown          : null,
    popUpMouseUp            : null,
    rgbSelectChange         : null
};

const objects = {
    views                   : [],
    cameras                 : [],
    object3Ds               : [],
    svgs                    : [],
    pcds                    : [],
    guideBox                : null,
    orbitControls           : [],
    PcdModel                : null,
    plane                   : null,
    rgbCameras              : [],
    classes                 : [],
    tags                    : [],
    // InspectErrorCodes       : [],
    taskInfo                : {
        taskCode     : null,
        taskName     : null
    },
    existData               : {
        projectId    : null,
        taskId   : null,
        workTicketId    : null,
        objectList   : null,
        tagList      : null
    }
};

const hugeData = {
    pcdPointData     : [],
    pcdPointColors   : [],
    colorIndexes     : []
};

const box3Data = {
    initWidth        : null,
    initHeight       : null,
    initDepth        : null,
    box3X            : null,
    box3Y            : null,
    box3Z            : null,
    pointBox3        : null,
    objectBox3       : null,
    pointBox3Size    : null,
    pointBox3Center  : null,
    objectBox3Size   : null,
    objectBox3Center : null
};

const sphereData = {
    position      : { x:0, y:0, z:0 },
    size          : { rad:0.2, ws:5, hs:10 },
    gap           : 0.4,
    color         : 0xffea00,
    hoverColor    : 0xFF0000
};




export { screen, settingData, defaultSettingData, globalData, cuboideData, cylinderData, svgData, events, objects, hugeData, box3Data, sphereData }