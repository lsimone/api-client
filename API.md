## Functions

<dl>
<dt><a href="#init">init(defaultHost, getDefaultHeaders, [options])</a></dt>
<dd></dd>
<dt><a href="#getClient">getClient(defaultHost, getDefaultHeaders, [options])</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#call">call(endpoint, [options])</a> ⇒ <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd></dd>
</dl>

<a name="init"></a>

## init(defaultHost, getDefaultHeaders, [options])
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| defaultHost | <code>String</code> |  |  |
| getDefaultHeaders | <code>function</code> |  |  |
| [options] | <code>Object</code> |  |  |
| [options.middlewares] | <code>Array.&lt;function()&gt;</code> |  |  |
| [options.mockServerPort] | <code>Number</code> |  |  |
| [options.debug] | <code>Boolean</code> |  | debug mode: log enabled |
| [options.mergeHeaders] | <code>Boolean</code> | <code>true</code> | if true, headers provided are merged with getDefaultHeaders() return object |

<a name="getClient"></a>

## getClient(defaultHost, getDefaultHeaders, [options]) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - call function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| defaultHost | <code>String</code> |  |  |
| getDefaultHeaders | <code>function</code> |  |  |
| [options] | <code>Object</code> |  |  |
| [options.middlewares] | <code>Array.&lt;function()&gt;</code> |  |  |
| [options.mockServerPort] | <code>Number</code> |  |  |
| [options.debug] | <code>Boolean</code> |  | debug mode: log enabled |
| [options.mergeHeaders] | <code>Boolean</code> | <code>true</code> | if true, headers provided are merged with getDefaultHeaders() return object |

<a name="call"></a>

## call(endpoint, [options]) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| endpoint | <code>String</code> |  |  |
| [options] | <code>Object</code> |  | options that override the defaults |
| [options.host] | <code>String</code> |  | target host for the request |
| [options.body] | <code>Object</code> |  | body payload sent through the request |
| [options.headers] | <code>Object</code> |  | they will override getDefaultHeaders() return object by default |
| [options.mergeHeaders] | <code>Boolean</code> | <code>true</code> | if true, headers provided are merged with getDefaultHeaders() return object |
| [options.mock] | <code>Object</code> | <code>false</code> | this object will be used as a temporary mock when an API endpoint is not ready yet. |
| [options.mockServerPort] | <code>Object</code> |  | mocking server port. |
| [options.fallback] | <code>Object</code> |  | this object will be used as response data when an API endpoint returns error (and no mock option is set). |
| [options.model] | <code>Object</code> |  | this object will be used through object-mapper in order to map the API response to our model. If not defined, no mapping will be performed. |
| [options.method] | <code>String</code> |  | if not defined, POST will be used if body is present, otherwise GET is used as default. |
| [options.params] | <code>Object</code> |  | this object is matched against the endpoint expression. All the parameters not present in it, |
| [options.fullResponse] | <code>Boolean</code> | <code>false</code> | it returns the whole response object (not only the data received) will be attached as query string |

## Functions

<dl>
<dt><a href="#init">init(defaultHost, getDefaultHeaders, [options])</a></dt>
<dd></dd>
<dt><a href="#getClient">getClient(defaultHost, getDefaultHeaders, [options])</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#call">call(endpoint, [options])</a> ⇒ <code>Promise.&lt;Object, Error&gt;</code></dt>
<dd></dd>
</dl>

<a name="init"></a>

## init(defaultHost, getDefaultHeaders, [options])
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| defaultHost | <code>String</code> |  |  |
| getDefaultHeaders | <code>function</code> |  |  |
| [options] | <code>Object</code> |  |  |
| [options.middlewares] | <code>Array.&lt;function()&gt;</code> |  |  |
| [options.mockServerPort] | <code>Number</code> |  |  |
| [options.debug] | <code>Boolean</code> |  | debug mode: log enabled |
| [options.mergeHeaders] | <code>Boolean</code> | <code>true</code> | if true, headers provided are merged with getDefaultHeaders() return object |

<a name="getClient"></a>

## getClient(defaultHost, getDefaultHeaders, [options]) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - call function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| defaultHost | <code>String</code> |  |  |
| getDefaultHeaders | <code>function</code> |  |  |
| [options] | <code>Object</code> |  |  |
| [options.middlewares] | <code>Array.&lt;function()&gt;</code> |  |  |
| [options.mockServerPort] | <code>Number</code> |  |  |
| [options.debug] | <code>Boolean</code> |  | debug mode: log enabled |
| [options.mergeHeaders] | <code>Boolean</code> | <code>true</code> | if true, headers provided are merged with getDefaultHeaders() return object |

<a name="call"></a>

## call(endpoint, [options]) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| endpoint | <code>String</code> |  |  |
| [options] | <code>Object</code> |  | options that override the defaults |
| [options.host] | <code>String</code> |  | target host for the request |
| [options.body] | <code>Object</code> |  | body payload sent through the request |
| [options.headers] | <code>Object</code> |  | they will override getDefaultHeaders() return object by default |
| [options.mergeHeaders] | <code>Boolean</code> | <code>true</code> | if true, headers provided are merged with getDefaultHeaders() return object |
| [options.timeout] | <code>Number</code> |  | timeout in ms: it will raise a client timeout error if response is not received before <timeout>ms. |
| [options.mock] | <code>Object</code> | <code>false</code> | this object will be used as a temporary mock when an API endpoint is not ready yet. |
| [options.mockServerPort] | <code>Object</code> |  | mocking server port. |
| [options.fallback] | <code>Object</code> |  | this object will be used as response data when an API endpoint returns error (and no mock option is set). |
| [options.model] | <code>Object</code> |  | this object will be used through object-mapper in order to map the API response to our model. If not defined, no mapping will be performed. |
| [options.method] | <code>String</code> |  | if not defined, POST will be used if body is present, otherwise GET is used as default. |
| [options.params] | <code>Object</code> |  | this object is matched against the endpoint expression. All the parameters not present in it, |
| [options.fullResponse] | <code>Boolean</code> | <code>false</code> | it returns the whole response object (not only the data received) will be attached as query string |

