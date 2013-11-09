SHELL:=/bin/zsh

NAME=Switcher

all: clean build
	@cp -R /Applications/node-webkit.app build/${NAME}.app
	@cp build/${NAME}.nw build/${NAME}.app/Contents/Resources/app.nw
	@cp asset/app.icns build/${NAME}.app/Contents/Resources/app.icns
	@cp asset/Info.plist build/${NAME}.app/Contents/

build:
	@mkdir -p build
	@(cd src; zip -r ../build/${NAME}.nw *)

install:
	@rm -rf /Applications/${NAME}.app
	@cp -R build/${NAME}.app /Applications/

clean:
	@rm -rf build
