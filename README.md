# Ipsum Fly v.0.2.1
**Structured Lorem Ipsum on the fly**

A jQuery plugin to quickly prototype page content using Lorem Ipsum sample text.

$( selector ).ipsumFly( [options] );

## Usage

**Include jQuery (requires v1.7 or higher)**

**Include ipsumFly.min.js**

```<script type="text/javascript" src="ipsumFly/ipsumFly.min.js"></script>```

## Example

**The following HTML structure**

```html
<div id="ipsum">
	<ul>
		<li data-ifly-repeat="3"></li>
	</ul>
	<p></p>
</div>
```

**will produce:**

```html
<div id="ipsum">
	<ul>
		<li data-ifly-repeat="3">lacinia rhoncus. Phasellus interdum</li>
		<li>Pellentesque eu risus</li>
		<li>magna. Mauris ornare</li>
		<li>Donec tellus leo, bibendum sit</li>
	</ul>
	<p>
		Ut sed massa bibendum leo malesuada consequat. Aenean elementum lorem non
		felis cursus rutrum. Nulla eu mi dui. Nam feugiat, ipsum vitae tincidunt
		elementum, nibh libero tincidunt odio, nec vulputate tellus mauris at ipsum.
		Phasellus hendrerit venenatis malesuada. Integer cursus eleifend neque eu
		tincidunt. Proin volutpat bibendum blandit. Aliquam sit amet purus dolor.
		Curabitur iaculis ipsum eget elit posuere a congue dolor mattis. Suspendisse
		accumsan dolor eget quam imperdiet id commodo arcu suscipit. Proin ultrices
		laoreet consequat.
	</p>
</div>
```

## Options

* `attrPrefix`: (String) The prefix for the HTML attribute used for tag specific rules. **Default**: "data-ifly-"
* `defaultRules`: (Object) A base set of rules for all tags. It is recommended to leave this alone. See below for more details.
* `groups`: (Array) An array of HTML tag groups that have the same set of rules. See below for more details.
* `tags`: (Object) A set of rules for particular tags. See below for more details.

## Overriding Rules

**Rules**

* `type`: (String) The type of text item to output. Acceptable values are "word", "paragraph", "character", or "none".
* `position`: (String) The position of the element in regards to it's parent text. Acceptable values are "before", "after", or "random".
* `maxSize`: (Number) The maximum number of text items to return.
* `repeat`: (Number) The number of times to repeat an element.

**Default**

```js
defaultRules: {
	type: 'word',
	position: 'before',
	maxSize: 2,
	repeat: 0
}
```

**Groups**

Groups are a way to apply a set of rules to multiple HTML elements at once. **Note:** *Group precedence is given in the order they are defined (later defined groups will override previous groups).*

Default groups:

```js
{
	tags: [
		'a', 'abbr', 'acroynm', 'b', 'big', 'cite', 'code', 'details', 'em',
		'label', 'q', 'samp', 'small', 'source', 'span', 'strong', 'sub',
		'summary', 'sup', 'texarea', 'tt'
	],
	rules: {
		position: 'random',
		maxSize: 4
	}
},
{
	tags: [
		'address', 'article', 'blockquote', 'div', 'dl', 'figcaption', 'h1', 'h2', 'h3',
		'h4', 'h5', 'h6', 'header', 'ol', 'p', 'pre', 'table', 'section', 'ul', 'li',
		'dd', 'dt', 'td'
	],
	rules: {
		type: 'paragraph',
		position: 'after',
		maxSize: 2,
	}
},
{
	tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
	rules: {
		type: 'word',
		position: 'before',
		maxSize: 5
	}
}
```

**Tags**

Tags are a way to apply a set of rules to one particular tag. These rules will override any rules defined in a group.

Default tags:

```js
'ul': {
	type: 'none'
},
'div': {
	type: 'none'
},
'li': {
	type: 'word',
	maxSize: 6
}
```

## TODO

* Consider allowing selectors to be used in groups. For instace: `tags: ['h1 > a']` would define rules for all **a** tags that are direct descendents of an **h1** tag.
* Add minSize option
* Consider adding support for img tags using placeholder image services.