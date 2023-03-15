import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {MyComposition} from './Composition';
import './style.css';

import {Project, getLayers, getLayerExtents} from 'engine';

const font = new FontFace(
	`Dank Mono`,
	`url('${staticFile(
		'/DankMono-Regular.ttf'
	)}') format('truetype'), url('${staticFile(
		'/DankMono-Italic.ttf'
	)}') format('truetype'), url('${staticFile(
		'/DankMono-Italic.ttf'
	)}') format('truetype')`
);

const waitForFont = delayRender();
font
	.load()
	.then(() => {
		document.fonts.add(font);
		continueRender(waitForFont);
	})
	.catch((err) => console.log('Error loading font', err));

import projectData from '../Code-1-project.json';

const FPS = 30;
const FONT_SIZE = 50;
const MARGIN = 50;

export const RemotionRoot: React.FC = () => {
	const layers = getLayers(projectData as Project, FONT_SIZE);
	const [width, height] = getLayerExtents(layers);

	const MyCompositionWrapper = () => (
		<MyComposition
			project={projectData as Project}
			layers={layers}
			fontSize={FONT_SIZE}
			inset={MARGIN / 2}
		/>
	);

	return (
		<>
			<Composition
				id="MyComp"
				component={MyCompositionWrapper}
				durationInFrames={projectData.totalTime * FPS}
				fps={FPS}
				width={Math.ceil(width + MARGIN)}
				height={Math.ceil(height + MARGIN)}
				defaultProps={{
					transparent: true,
				}}
			/>
		</>
	);
};
