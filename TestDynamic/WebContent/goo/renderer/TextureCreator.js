define(['goo/renderer/Loader', 'goo/renderer/Texture'], function(Loader, Texture) {
	"use strict";

	/**
	 * @name TextureCreator
	 * @class TBD
	 * @param {Settings} settings Texturing settings
	 */
	function TextureCreator(settings) {
		settings = settings || {};

		this.verticalFlip = settings.verticalFlip || true;
		this.storeFormat = settings.storeFormat || 'RGBA'; // Alpha, RGB, RGBA,
		// Luminance,
		// LuminanceAlpha;
		this.minFilter = settings.verticalFlip || 'Trilinear';

		this.textureLoaders = {
		// '.png' : 'loader1',
		// '.dds' : 'loader2'
		};

	}

	TextureCreator.cache = {};
	TextureCreator.UNSUPPORTED_FALLBACK = '.png';

	TextureCreator.prototype.loadTexture2D = function(imageURL) {
		for (extension in this.textureLoaders) {
			if (imageURL.toLowerCase().endsWith(extension)) {
				var loader = this.textureLoaders[extension];
				console.log(extension + ' - ' + loader);

				if (!loader || !loader.isSupported) {
					imageURL = imageURL.substring(0, imageURL.length() - extension.length());
					imageURL += TextureCreator.UNSUPPORTED_FALLBACK;
					break;
				}

				// create a key
				var key = TextureKey.getKey(null, _verticalFlip, _storeFormat, imageURL, _minFilter);
				// check for cache version
				var cached = findTexture2D(key);
				if (cached !== null) {
					return cached;
				}

				// make a dummy texture to fill on load = similar to normal
				// path, but using arraybuffer instead
				var rVal = creatureNewTexture2D(key);

				// from URL
				var resourceLoader = new RequestBuilderResourceLoader();
				var url = imageURL;
				var finalLoader = loader;
				resourceLoader.loadBinaryAsArrayBuffer(url, {
					onSuccess : function(/* ArrayBuffer */response) {
						// TextureCreator.logger.fine("Loading dds: " + url);
						finalLoader.load(response, rVal, key.isFlipped(), 0, response.getByteLength());

						callLoadCallback(url);
					},
					onError : function(t) {
						TextureCreator.logger.log(Level.SEVERE, "Error loading texture: " + url, t);
						TextureState.getDefaultTexture().createSimpleClone(rVal);
					}
				});

				// return standin while we wait for texture to load.
				return rVal;
			}
		}

		if (TextureCreator.cache[imageURL] !== undefined) {
			return TextureCreator.cache[imageURL];
		}

		var img = new Loader().loadImage(imageURL);
		var texture = new Texture(img);

		TextureCreator.cache[imageURL] = texture;

		return texture;
	};

	TextureCreator.prototype.loadTextureCube = function(imageURLs) {
		var latch = 6;
		var texture = new Texture();
		var images = [];

		for ( var i = 0; i < imageURLs.length; i++) {
			(function(index) {
				new Loader().loadImage(imageURLs[index], {
					onSuccess : function(image) {
						images[index] = image;
						latch--;
						if (latch <= 0) {
							texture.setImage(images);
						}
					},
					onError : function(message) {
						console.error(message);
					}
				});
			})(i);
		}

		return texture;
	};

	var colorInfo = new Uint8Array([255, 255, 255, 255]);
	TextureCreator.DEFAULT_TEXTURE_2D = new Texture(colorInfo, null, 1, 1);
	TextureCreator.DEFAULT_TEXTURE_CUBE = new Texture([colorInfo, colorInfo, colorInfo, colorInfo, colorInfo, colorInfo], null, 1, 1);

	return TextureCreator;
});