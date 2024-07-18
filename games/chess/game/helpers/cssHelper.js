function setBoardSize() {
    const board = document.querySelector('.board');
    board.style.height = "100%";
    board.style.width = `${board.offsetHeight}px`;

    const boardWidth = board.offsetWidth;
    const boardHeight = board.offsetHeight;

    const sideLength = boardWidth <= boardHeight ? boardWidth: boardHeight;
    
    board.style.width = `${sideLength}px`;
    board.style.height = `${sideLength}px`;
}

setBoardSize();
setSidebarSize();
window.addEventListener('resize', () => {
    setBoardSize();
    setSidebarSize();
    prevWindowWidth = window.innerWidth;
});

let prevWindowWidth = window.innerWidth;

//sidebars
function setSidebarSize() {
    const board = document.querySelector('.board');

    const sidebars = document.querySelectorAll('.sidebar');

    const sidebarWidth = (sidebars[0].offsetWidth + sidebars[1].offsetWidth) / 2;
    sidebars.forEach((sidebar) => {
        sidebar.style.height = board.style.height;
        sidebar.style.width = `${sidebarWidth}px`;
    });

    const boardContainer = document.querySelector('.board_container');
    const actualBCWidth = board.offsetWidth + sidebars[0].offsetWidth * 2;

    boardContainer.style.justifyContent = 'center';
    if (actualBCWidth > window.innerWidth) {
        boardContainer.style.justifyContent = 'left';
    }
}