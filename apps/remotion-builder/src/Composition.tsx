import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

import {Project, Layer} from 'engine';
import Preview from 'preview-react';

export const MyComposition = ({
	layers,
	project,
	fontSize,
	inset = 0,
}: {
	layers: Layer[];
	project: Project;
	fontSize: number;
	inset: number;
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				left: inset,
				top: inset,
			}}
		>
			<Preview
				layers={layers}
				project={project as Project}
				time={frame / fps}
				fontSize={fontSize}
				width="100%"
				height="100%"
			/>
		</AbsoluteFill>
	);
};
