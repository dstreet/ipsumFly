var IpsumGenerator = window.IpsumGenerator;

module('loopSlice');
test('', function() {
	var ig = new IpsumGenerator();
	var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

	deepEqual(ig.loopSlice(arr, 0, 4), ['a', 'b', 'c', 'd'], 'Slice without looping');
	deepEqual(ig.loopSlice(arr, 3, 4, true), ['d', 'c', 'b', 'a'], 'Slice without looping in reverse');
	deepEqual(ig.loopSlice(arr, 0, 12), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'a', 'b'], 'Loop through to the beginning to fill length');
	deepEqual(ig.loopSlice(arr, 9, 12, true), ['j', 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a', 'j', 'i'], 'Loop through to the end to fill length');
});

module('getTextItems');
test('length', function() {
	var ig = new IpsumGenerator();

	equal(ig.getTextItems(2, 'paragraph').length, 2, 'Get two paragraphs');
	equal(ig.getTextItems(3, 'word').length, 3, 'Get three words');
	equal(ig.getTextItems(140, 'character').length, 140, 'Get 140 characters');
});

test('starts with', function() {
	var ig = new IpsumGenerator();

	equal(ig.getTextItems(1, 'paragraph')[0].split(' ').slice(0, 2).join(' '), 'Lorem ipsum', 'Paragraph starts with "Lorem ipsum"');
	equal(ig.getTextItems(2, 'word').join(' '), 'Lorem ipsum', 'Words start with "Lorem ipsum"');
	equal(ig.getTextItems(11, 'character').join(''), 'Lorem ipsum', 'Characters start with "Lorem ipsum"');
});

module('extendOptions');
test('update with new options', function() {
	var ig = new IpsumGenerator();
	var newOptions = {
		groups: [
			{
				tags: ['a', 'b', 'i'],
				rules: {
					position: 'random',
					type: 'word'
				}
			}
		],
		tags: {
			'span': {
				type: 'character',
				maxSize: 140,
				repeat: 2
			},
			'default': {
				type: 'character'
			}
		}
	};

	ig.extendOptions(newOptions);
	var lastIndex = ig.options.groups.length-1;

	deepEqual(ig.options.groups[lastIndex], newOptions.groups[0], 'New group is added to the end of the array of groups');
	deepEqual(ig.options.tags.span, newOptions.tags.span, 'Span tag was added into the `tags` object.');
	equal(ig.options.tags.default.type, newOptions.tags.default.type, 'Type in the default tag was overwritten by new data.');
});

module('getElementOptions');
test('', function() {
	var ig = new IpsumGenerator();
	var $ele1 = $('<div data-ifly-maxSize="200">');
	var $ele2 = $('<notag>');

	console.log(ig.options.defaultRules);

	equal(ig.getElementOptions($ele1).maxSize, 200, 'Option overriden by tag attribute');
	deepEqual(ig.getElementOptions($ele2), ig.options.defaultRules, 'Unidentified tag is set to the default options');
});