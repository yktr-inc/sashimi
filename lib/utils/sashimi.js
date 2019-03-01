import Router from '/node_modules/sashimi/lib/utils/router.js';

export const createComponent = (element, props, children) => {
    const aDiv = document.createElement(element);
    if(props){
      constructProps(aDiv, props);
    }
    const childrenDivs = handleChildren(children);
    childrenDivs.forEach( child => aDiv.appendChild(child));
    return aDiv;
};

const constructProps = (element, props) =>
  Object.entries(props).forEach(entry =>
    element.setAttribute(entry[0], entry[1]));

export const createElement = (element, props, ...children) => createComponent(element, props, children);

export const handleChildren = children => {
    const arrChildren = Object.values(children);
    return arrChildren.map( child => renderChild(child));
};

export const renderChild = child => {

    const childDiv = document.createElement('div');

    if (typeof child === 'string'){

      const childrenContent = document.createTextNode(child);
      childDiv.appendChild(childrenContent);

    }else if (typeof child === 'function'){
      childDiv.appendChild(child());
    }else {
      childDiv.appendChild(child);
    }
    return childDiv;
};

export const render = (el, domEl) => domEl.appendChild(el);

export const renderRoot = el => {
  const Root = createElement('div', null, el);
  document.getElementById('root').appendChild(Root);
}
export const boot = (routes) => {
  const router = new Router(routes);
  const urlChange = bootEvent(router);
  renderRouter(router);

};

export const renderRouter = (router) => {
  const matchedRoute = router.matchRoute();
  renderRoot(router._routes[matchedRoute]());
}

export const bootEvent = (router) => {
  window.addEventListener('hashchange', function() {
      document.getElementById('root').innerHTML = '';
      renderRouter(router);
  });
}

export default createElement;


