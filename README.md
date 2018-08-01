# invock-js
Javascript Framework for building User Interface Components

It's Aplha Version not ready for production.

NB : Please Create the Issues in github if a problem appear.[invock-js Issues](https://github.com/said10/invock-js/issues)

# Table of contents

- [Installation](#installation)
- [Architecture](#Architecture)
- [Get Started](#Get Started)
- [Component](#Component)
- [Mount Component](#Mount Component)
- [Template Language](#Template Language)
- [Filter](#Filter)
- [State & Props](#State & Props)
- [Events](#Events)
- [If Condition](#If Condition)
- [Else Condition](#Else Condition)
- [For-Loop operation](#For-Loop operation)
- [Methodes of Component](#Methodes of Component)
- [State Management](#State Management)
- [Module HTTP](#Module HTTP)
- [Module Layout](#Module Layout)
- [Desktop & Mobile management](#Desktop & Mobile management)
- [Plugins for DOM manipulation](#Plugins for DOM manipulation)
- [Module Layout](#Module Layout)
- [Module Router](#Module Router)
- [Advanced State Management](#advanced-state-management)
- [Module UI](#Module UI)
- [Middlwares](#Middlwares)
- [Extra things](#Extra things)
- [Exemples & Demos](#Exemples & Demos)
- [Ressources](#Ressources)
- [License](#License)

## Installation

Installation from npm

```js
npm install invock-js
```

For Browser Use
```js
<script src="js/dist/invock.js"></script>
```

## Get Started

To start with invock-js you have to clone the project GET_STARTED in order to use invock-js quickly. 
```js
git clone https://github.com/said10/invock-js-get-started.git
npm install
```
The directory contains all the items you will need to get started :/

```js
npm start
```

## Component
to create your components you need to extend from Component Object like this :
```js
import invock, {Component} from "invock-js";

class Header extends Component {
    
    constructor(props) {
        super(props);
    }
    render() {
        return `
            <h1>Hello World</h1>
        `;
    }
}
```
Then you have to export the created component like that

```js
invock.export("Header", Header);
```

## Mount Component

to display a component on the DOM of your application it is necessary to do

```js
invock.mount({ parent : "#container", root : "{% Header %}" });
```
Note: it is not necessary to use invock.mount on each component just creates the export is mandatory, but for invock.mount it's better to use it just on the main component of your application

## Template Language

the language template used to describe your components is inspired by Jinja2 (templating engine for Python), it is very simple and easy to use since it is used on many Framework and tools.

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super(props);
        this.props.title = "Hello World";
    }
    render() {
        return `
            <h1>{{props.title}}</h1>
        `;
    }
}
invock.export("Header", Header);
```
to be able to call a component inside another component in the HTML code you have to do this

```js
import invock, {Component} from "invock-js";
import Title from "invock-js";

class Header extends Component {
    render() {
        return `
            {% Title %}
        `;
    }
}
invock.export("Header", Header);
```

## Filter
the role of Filter module is to help you to process and manipulate data in a transparent way without touching the DOM which is itself is cut through by JS,
Example making a text uppercase
```js
render() {
    return `
        <h1>{{props.title|upper}}</h1>
    `;
}
```
the Filter module contains by default more than 22 ready-to-use filter to be able to do the basic treatments without you developing them every time, these filters accept parameters to give you more flexibility and control over the rendering of your data in the components.

of course you can create your own filter with the minimum of code and time.
```js
import {Filter}

// Filter.addFilter(name, function of Filter)

Filter.addFilter("default", function(value, param) {
    if (value === "") {
        return param;
    }
    else {
        return value;
    }
});
```

The role of this filter is to replace the value of the variable that is an empty string with the word "empty".
```js

render() {
    return `
        <h1>{{props.title|default:empty}}</h1>
    `;
}
```

## State & Props
to create dynamic and interactive components you need data and display it so that the user can interact with your interface OR application, that's why it comes the role of Props&State to give you the ability to dynamize your components in an intuitive and dynamic way.

basic example
```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
        this.props = { title : "Hello World" };
        this.state = { name : "invock-js" };
    }
    render() {
        return `
            <h1>{{props.title}}</h1>
            <h1>{{state.name}}</h1>
        `;
    }
}
invock.export("Header", Header);
```

advanced example
```js
import invock, {Component} from "invock-js";
import Header from './components/header';

class HomePage extends Component {
    constructor(props) {
        super (props);
    }
    render() {
        return `
            {% Header title="Hello World" %}
        `;
    }
}
invock.export("HomePage", HomePage);
```
the TITLE property is passed to the HEADER component by the Object PROPS, which will be displayed in its own DOM.

## Events

to launch invock-js event which contains a system that is a little different compared to other Framework, this system is inspired by the events system of "backbons.js"

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    
    constructor(props) {
        super(props);
        this.events = {
            "click h1" : "clickH1"
        };
    }
    
    clickH1(evt, self) {
        console.log(evt);
        // return the Event Object
        console.log(self);
        // return the Component Object (Header)
    }
                                
    render() {
        return `
            <h1>Hello World</h1>
        `;
    }
}
```

this is another way to launch an event for DOM elements.

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    
    constructor(props) {
        super(props);
        // addEvent(selector, event_type, callback, options)
        this.addEvent("h1", "click", "clickH1", {})
    }
    
    clickH1(evt, self, options) {
        console.log(evt);
        // return the Event Object
        console.log(self);
        // return the Component Object (Header)
        console.log(options);
        // return the Options Object passed in addEvent Method
    }
                                
    render() {
        return `
            <h1>Hello World</h1>
        `;
    }
}
```


## If Condition

Create a condition in a component is very simple and intuitive in order to have a readable code.

Basic Exemple
```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
        this.props = { title : "Hello World" };
    }
    render() {
        return `
            {% if props.title = "Hello World" %}
                <h1>{{props.title}}</h1>
            {% endif %}
        `;
    }
}
invock.export("Header", Header);
```

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
        this.props = { title : "Hello World", count : 0, status : true };
    }
    render() {
        return `
            {% if props.title = "Hello World" AND props.count = 1 %}
                <h1>{{props.title}}</h1>
            {% endif %}

            {% if props.title != "Hello World" OR props.count = 0 %}
                <h1>{{props.title}}</h1>
            {% endif %}

            {% if props.title = "Hello World" OR props.count > 10 %}
                <h1>{{props.title}}</h1>
            {% endif %}

            {% if props.title = "Hello World" OR props.count >= 20 %}
                <h1>{{props.title}}</h1>
            {% endif %}

            {% if props.title = "Hello World" OR props.count < 20 %}
                <h1>{{props.title}}</h1>
            {% endif %}

            {% if props.title = "Hello World" OR props.count <= 20 %}
                <h1>{{props.title}}</h1>
            {% endif %}

            {% if props.status = true OR props.count <= 20 %}
                <h1>{{props.title}}</h1>
            {% endif %}
        `;
    }
}
invock.export("Header", Header);
```

## Else Condition

It is the same thing to do an ELSE it is necessary to do this :

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
        this.props = { title : "Hello World" };
    }
    render() {
        return `
            {% if props.title != "Hello World" %}
                <h1>{{props.title}}</h1>
            {% else %}
                <h1>Display : {{props.title}}</h1>
            {% endif %}
        `;
    }
}
invock.export("Header", Header);
```

## For-Loop operation

the creation of the FOR loops is very simple as on jinga2 it is necessary to do this :

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
        this.state = { numbers : [ 0,1,2,3,4,5 ] };
    }
    render() {
        return `
            {% for number in state.numbers %}
                <h3>{{number}}</h3>
            {% endif %}
        `;
    }
}
invock.export("Header", Header);
```
note: you can use just the loops with PROPS& STATE objects.



## Methodes of Component

Each component contains methods that will be useful in the development phase to be able to control the flow of data and the interactions with the users of your application.

among these methods there is :

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
    }
    
    beforeRender() {
        // this feature of launches before the rendering operation begins
    }
    
    AfterRender() {
        // this feature launches after each rendering operation done
    }
                                
    beforeUpdate() {
    
    }
    
    afterUpdate() {
    
    }
    
    render() {
        return `
            <h3>Hello World</h3>
        `;
    }
}
invock.export("Header", Header);
```

## State Management

The management of the state is very dynamic and transparent so that you can modify your components in an optimal and efficient way, when a change is detected the system just interact with the DOM element in the target component, without doing the reRendering of the component.

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
        this.state = {
            title : "hello World"
        }
    }
    
    AfterRender() {
        var self = this;
        var timer = setTimeout(function() {
            self.setState({ title : "invock-js" })
        }, 5000)
    }
    
    render() {
        return `
            <h3>{{state.title}}</h3>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus porttitor semper imperdiet. Nunc gravida turpis nec purus maximus viverra.
            </p>
        `;
    }
}
invock.export("Header", Header);
```


## Module HTTP
The HTTP module provides useful methods for you to communicate and interact with the server and consume web services via AJAX requests, you can also modify the configurations of the module to adapt it to your business needs for your application.
the HTTP Module is built into the Component object by default to provide a simple API to use.
```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
    }
    
    beforeRender() {
        this.http.url = "/api/exemple/data.json";
        this.http.fetch(function(response) {
            console.log(response);
        }, function(error) {
            console.log(error);
        })
    }
    
    render() {
        return `
            <h3>Hello World</h3>
        `;
    }
}
invock.export("Header", Header);
```
among the methods of the HTP module there is
- fetch(success_fn, error_fn) : retrieve data from a URL
- post(data, success_fn, error_fn) : post data to the server
- update(data, success_fn, error_fn) : update the data in the server
- delete(data, success_fn, error_fn) : delete one or more element in the server

in Component Object 
- getDataJSON(url, error_fn) : retrieve data from the server before the rendering operation

## Module Layout

The Layout module's role is to organize and reuse layouts in different views and applications with minimum effort.

```js
import invock, {Component} from "invock-js";
import LayoutHome from "../layouts/home";

class App extends Component {
    render() {
        return `
            <layout name="layoutHome">
                <div block-layout="header">
                    <h3>Header Block</h3>
                </div>
                <div block-layout="side-bar">
                    <h3>Side-bar Block</h3>
                </div>
                <div block-layout="content">
                    <h3>Content Block</h3>
                </div>
            <layout>
        `;
    }
}
invock.export("App", App);
```
to create your own layout it is very simple it takes :

```js
import invock, {Layout} from "invock-js";
import LayoutHome from "../layouts/home";

class LayoutHome extends Component {
    createLayout() {
        this.name = "LayoutHome";
                    
        this.AddCSS("css/layout/home.css");
                    
        //this.addBlock("id", "classess", "parent");
        
        this.addBlock("header", "header-top");
        this.addBlock("side", "left side-content");
        this.addBlock("content", "left");
        this.addBlockCleaner();
    }
}
invock.exportLayout("LayoutHome", LayoutHome);
```

## Desktop & Mobile management
invock-js offers the possibility to create 2 versions of UI, one for the Desktop and another one for the Mobile in the same component without sacrificing your business logic layer so that the same layer can be used in both versions. a totally transparent way.

```js
import invock, {Component} from "invock-js";

class Header extends Component {
    constructor(props) {
        super (props);
        this.events = {
            "click h1" : "clickH1"
        };
    }
    clickH1(evt, self) {
        console.log(evt.target.data("version"));
    }
    
    render() {
        return `
            <desktop>
                <h3 data-version="desktop">Desktop Version</h3>
            </desktop>
            <mobile>
                <h3 data-version="mobile">Mobile Version</h3>
            </mobile>
        `;
    }
}
invock.export("Header", Header);
```

## Plugins for DOM manipulation
in a web application you will still need to implement interactive elements with the user such as :
- popup  
- slider
- carousel
- validator 
- notification bar
- ...

invock-js offers a small plugins system so that you can create your own, in order to apply manipulations on the DOM, building your plugin is a simple operation and its goal is not to hack your JS code.

to create a plugin you need

```js
import {dom} from "invock-js";
const plugin = dom.addPlugin("plugin", function(params) {
	var element = this;
	params = params || {};
    var name = this.data("name");
    var parent_element = element.getParent()
    if (name === "invock-js") {
        parent_element.addClass("active");
    }
    else {
        parent_element.removeClass("active");
    }
});                                                            
```

to use a plugin you have to:
```js
import invock, {Component} from "invock-js";
import plugin from "../plugins/plugin";

class Header extends Component {
    constructor(props) {
        super (props);
    }
                                
    afterRender() {
        var h3 = this.parent.find("h3");
        h3.runPlugin("plugin", {});
    }
    
    render() {
        return `
            <desktop>
                <h3 data-version="desktop" data-name="invock-js">Version desktop</h3>
            </desktop>
            <mobile>
                <h3 data-version="mobile">Version Mobile</h3>
            </mobile>
        `;
    }
}
invock.export("Header", Header);
```

## Module Router
The module Router aims to help you create SPA it manages links and views for you, the module contains 2 main components : 
- Link : to create links that you need for your menu for example
- Route : it is the component that will manage the view link with it according to active URL in the application

to create a menu here is an example :

```js
import invock, {Component, Link} from "invock-js";

class Menu extends Component {
    constructor(props) {
        super(props);
        
    }
    
    render() {
        return `
            <desktop>
                <div class="navigation white shadow align-center">
                    <ul class="horizontal center-auto">
                        <li>{% Link url="/" name="Home" classes="color" %}</li>
                        <li>{% Link url="/about" name="About" classes="color" %}</li>
                        <li>{% Link url="/contact" name="Contact" classes="color" %}</li>
                    </ul>
                    <div class="clr"></div>
                </div>
            </desktop>
        `;
    }
}

invock.export("Menu", Menu);
```
to create a view with a route :

```js
import invock, {Component} from "invock-js";
import Menu from './menu';
import Home from './views/home';
import About from './views/about';
import Contact from './views/contact';

class App extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return `
            <desktop>
                <div class="app">
                    {% Menu %}
                    <div id="views">
                        {% Route path="/" component="Home" title="Home Page" name="home" %}
                        {% Route path="/about" component="About" title="About" name="about" %}
                        {% Route path="/contact" component="Contact" title="Contact" name="contact" %}
                    </div>
                </div>
            </desktop>
        `;
    }
}
invock.export("App", App);
invock.mount({ parent : "#container", root : "{% App %}" });
```

## Advanced State Management

this section to treat the problem that is related with the management of the state of the components in an application that each Framework must face and presents answers for this question. 

invock-js offers a global Store to store all the states for all the components of the application and you can access any component or its data provided that you respect a few small recommendations.

we start by telling invock-js that this component will interact with the Store.

```js
import invock, {Component} from "invock-js";

class header extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return `
            <desktop>
                <div class="app">
                    <h1>{{props.title}}</h1>
                </div>
            </desktop>
        `;
    }
}
invock.export("header", header);
invock.mountInStore({ parent : "#container", root : "{% header %}" });
```
then we pass the properties that the component or components need.

```js
import invock, {Component} from "invock-js";

class header extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return `
            <desktop>
                <div class="app">
                    <h1>{{props.title}}</h1>
                    <h2>{{props.name}}</h2>
                </div>
            </desktop>
        `;
    }
}
invock.addProps({
    title : "Hello World",
    name : "invock-js"
})
invock.export("header", header);
invock.mountInStore({ parent : "#container", root : "{% header %}" }, "title,name");
```

The properties you want to pass to a component needs must be configured on invock.mountInStore or invock.export and must be separated by a comma.

Calling the invock.addProps function is not necessary on every component, it is better to just call the parent component or View component of your application.

Note: invock-js stores by default all the properties of the components in the Store which means the communication between the components is much easier especially that we have a complex application or a very specific work logic.

Other exemple : 

```js
import invock, {Component} from "invock-js";

class header extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return `
            <desktop>
                <div class="app">
                    <h1>{{props.title}}</h1>
                    <h2>{{props.name}}</h2>
                </div>
            </desktop>
        `;
    }
}
invock.addProps({
    title : "Hello World",
    name : "invock-js"
})
invock.export("header", header, "title,name");
```

## Module UI
Please visit this link for more informations and details :
[invock-js-ui](https://github.com/said10/invock-js-ui)

## Middlwares
comming soon

## Extra things
comming soon

## Exemples & Demos
comming soon

## Ressources
- [dom](https://github.com/said10/domJS)
- [parser](https://github.com/said10/parserHTML)
- [Sample UI](https://github.com/said10/sample-ui)
- Template Language insipred by [jinga2](http://jinja.pocoo.org/docs/2.10/)
- Event System insipred by [backbone.js](http://backbonejs.org/)

## License
GPU - [Said10](https://github.com/said10/)


