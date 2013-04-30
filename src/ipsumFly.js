/**
 * Ipsum Fly v.0.1.0
 * Structured Lorem Ipsum on the fly
 * A jQuery plugin to quickly prototype page content using Lorem Ipsum sample text.
 *
 * Copyright 2013 David Street
 * Licensed under the MIT license.
 */

(function($, ipsum) {

	/**
	 * Lorem Ipsum generator class
	 * 
	 * @class IpsumGenerator
	 */
	var IpsumGenerator = function() {
		this.ipsum = ipsum;

		/*
		 * TODO: Consider adding two different child attachment options: insert and integrate. Currently only supporting insertion.
		 */
		this.options = {
			attrPrefix: 'data-ifly-',
			defaultRules: {
				type: 'word',
				position: 'before',
				maxSize: 2,
				repeat: 0
			},
			// Groups array must be in order of precedence, with the highest precedence at the end.
			groups: [
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
			],
			tags: {
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
			}
		};
	};


	/**
	 * Utility method to return an extended options object. The method will append any
	 * array elements to an array, extend an object, and set the value for any primative
	 * data type.
	 * 
	 * @function extendOptions
	 * @param options The options to extend with
	 * @returns {Object}
	 */
	IpsumGenerator.prototype.extendOptions = function(options) {
		var newOptions = $.extend({}, this.options);

		for (var prop in options) {
			if (newOptions.hasOwnProperty(prop)) {
				// If the property is an array, append it to the end of the original.
				if ($.isArray(options[prop])) {
					newOptions[prop] = newOptions[prop].concat(options[prop]);
				// If the property is an object, extend the original.
				} else if (typeof(options[prop]) === 'object') {
					$.extend(newOptions[prop], options[prop]);
				// Anything else, set the value.
				} else {
					newOptions[prop] = options[prop];
				}
			}
		}

		this.options = newOptions;
	};

	
	/**
	 * Utility method to return a slice from an array. Looping back on itself it exceeds
	 * it's range.
	 * 
	 * @function loopSlice
	 * @param arr The array to slice
	 * @param start The starting index
	 * @param len The number of elements to return
	 * @param reverse Whether to reverse the direction
	 * @returns {Array}
	 */
	IpsumGenerator.prototype.loopSlice = function(arr, start, len, reverse) {
		var arrLen = arr.length
			, returnArr = []
			, reverse = (reverse != undefined ? reverse : false)
			, i = start
			, pos = (!reverse ? start-1 : start+1);

		// If we do not need to loop, then fallback to the slice method.
		if (!reverse && (start + len) <= arrLen) {
			return arr.slice(start, start+len);
		}

		// Loop through the array until we have all the elements we need.
		for (i; i < (start + len); i += 1) {
			if (!reverse) {
				if (pos >= (arrLen-1)) {
					pos = 0;
				} else {
					pos += 1;
				}
			} else {
				if (pos <= 0) {
					pos = (arrLen - 1);
				} else {
					pos -= 1;
				}
			}
			returnArr.push(arr[pos]);
		}

		return returnArr;
	}

	
	/**
	 * Method to return an array of text items
	 * 
	 * @function getTextItems
	 * @param num The number of paragraphs to return
	 * @param type The type of text item to return. Values include `paragraph`, `word`, or `character`.
	 * @param startWith Whether or not to start with `Loreum Ipsum`
	 * @returns {String}
	 */
	IpsumGenerator.prototype.getTextItems = function(num, type, startWith) {
		var allItems = []
			, startWith = (startWith != undefined ? startWith : true)
			, startIndex = 0;

		// Get the text items based on the type provided.
		switch (type) {
			case 'word':
				allItems = this.ipsum.split(' ');
				break;
			case 'character':
				allItems = this.ipsum.replace('\n', '').split('');
				break;
			case 'paragraph':
			default:
				allItems = this.ipsum.replace('\n', '').split('\n');
				break;
		}

		if (!startWith) {
			// Choose a random starting index.
			startIndex = Math.floor(Math.random() * allItems.length + 1);
		}
		
		return this.loopSlice(allItems, startIndex, num);
	}


	/**
	 * Method to get the options for the particular element. Precedence is given in the following order:
	 * HTML data attributes, explicit tag options, block or inline tag options, default tag options
	 * 
	 * @function getElementOptions
	 * @param $ele The jQuery element
	 * @returns {Object}
	 */
	IpsumGenerator.prototype.getElementOptions = function($ele) {
		var optionKeys = ['repeat', 'position', 'maxSize', 'type']
			, tagname = $ele[0].tagName.toLowerCase()
			, returnOptions = $.extend({}, this.options.defaultRules)
			, attrValue = ''
			, i = 0;

		// Get options from group defaults
		for (var g = 0; g < this.options.groups.length; g += 1) {
			if (this.options.groups[g].tags.indexOf(tagname) != -1 && this.options.groups[g].hasOwnProperty('rules')) {
				$.extend(returnOptions, this.options.groups[g].rules);
			}
		}

		// Get explicit options for the specific tagname
		if (this.options.tags.hasOwnProperty(tagname)) {
			$.extend(returnOptions, this.options.tags[tagname]);
		}

		// Get options set in the data attributes
		for (i; i < optionKeys.length; i += 1) {
			attrValue = $ele.attr(this.options.attrPrefix + optionKeys[i]);

			if (attrValue) {
				returnOptions[optionKeys[i]] = $ele.attr(this.options.attrPrefix + optionKeys[i]);
			}

		}

		return returnOptions;
	};


	/**
	 * Method to return the HTML for an element including all of it's children
	 * 
	 * @function getHtml
	 * @param $ele The jQuery element
	 * @param $parent The jQuery parent element
	 * @returns {Object}
	 */
	IpsumGenerator.prototype.getHtml = function($ele, $parent) {
		var $children = $ele.children()
			, elementOptions = this.getElementOptions($ele)
			, children = []
			, pos = 0
			, elePos = 0
			, size = Math.floor(Math.random() * elementOptions.maxSize + 1)
			, delimiter = ' '
			, $tmpEle = null
			, tmpHtml = ''
			, parentTextItems = []
			, newTextItems = []
			, self = this;

		switch (elementOptions.type) {
			case 'paragraph':
				delimiter = '\n';
				newTextItems = this.getTextItems(size, 'paragraph', false);
				break;
			case 'character':
				delimiter = '';
				newTextItems = this.getTextItems(size, 'character', false);
				break;
			case 'none':
				// Keep the inner html structure intact with child elements in their current positions
				children = $ele.contents();
				for (var c = 0; c < children.length; c += 1) {
					if (children[c].nodeType == 3) { // Text node
						tmpHtml += children[c].nodeValue;
					} else {
						tmpHtml += this.getHtml($(children[c]), $ele).html;
					}
				}
				newTextItems = [tmpHtml];
				children = [];
				break;
			default:
			case 'word':
				delimiter = ' ';
				newTextItems = this.getTextItems(size, 'word', false);
				break;
		}

		// If we are working with a child element that needs to be inserted into the parent
		if ($parent != undefined) {
			parentTextItems = $parent.text().split(delimiter);

			switch (elementOptions.position) {
				case 'random':
					pos = Math.floor(Math.random() * parentTextItems.length);
					break;
				case 'after':
					pos = parentTextItems.length;
					break;
				default:
				case 'before':
					pos = 0;
					break;
			}

			elePos = parentTextItems.slice(0, pos).join(delimiter).length;
		}

		$tmpEle = $ele.clone().empty().html(newTextItems.join(delimiter));

		// Get the HTML for each child element
		if (elementOptions.type !== 'none') {
			$children.each(function(c){
				newChild = self.getHtml($(this), $tmpEle);
				children.push(newChild);
				
				// Insert a placeholder for the child into the html of the parent element
				$tmpEle = $ele.clone().empty().text(
					$tmpEle.text().substring(0, newChild.position) + ' {' + c + '}' + $tmpEle.text().substring(newChild.position)
				);
			});
		}

		tmpHtml = $tmpEle[0].outerHTML;

		// Replace placeholers with the proper child html
		for (c in children) {
			tmpHtml = tmpHtml.replace('{'+c+'}', children[c].html);
		}

		// Repeat element if needed
		if (elementOptions.hasOwnProperty('repeat')) {
			$tmpEle = $ele.clone().removeAttr(this.options.attrPrefix + 'repeat');

			for (var i = 0; i < elementOptions.repeat; i += 1) {
				tmpHtml += this.getHtml($tmpEle, $parent).html;
			}
		}

		// Remove any white space between two html tags
		tmpHtml = tmpHtml.replace(/>\s+</g, '><');

		return {
			html: tmpHtml,
			position: elePos
		};

	}

	// For testing purposes only
	window.IpsumGenerator = IpsumGenerator;
	
	$.fn.ipsumFly = function() {
		return this.each(function() {
			var ipsumGenerator = new IpsumGenerator();

			newHtml = ipsumGenerator.getHtml($(this)).html;
			this.outerHTML = newHtml;
		});
	};

})(jQuery, ipsum)