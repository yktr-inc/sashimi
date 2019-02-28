class Router {
  constructor(routes){
    this._routes = routes;
  }

  matchRoute() {
    const path = window.location.hash.split('#')[1];
    const cleanPath = this.cleanPath(path);

    return Object.keys(this._routes).find(entry => entry === cleanPath);
  }

  cleanPath(path) {

    let cleanPath = (typeof path === 'undefined') ? '/' : path;

    cleanPath = path;

    if(path[path.length -1] !== '/'){
      cleanPath =`${path}/`;
    }

    return cleanPath;
  }

}

export default Router;
