import { QuartzConfig } from "./quartz/cfg";
import * as Plugin from "./quartz/plugins";
import { Argv, BuildCtx } from "./quartz/util/ctx";
import fs from "fs";
import path from "path";
import { FilePath } from "./quartz/util/path";
import { glob } from "./quartz/util/glob";

// Custom plugin to copy all files from static/ to the root of public/
const CopyStatic = () => ({
	name: "CopyStatic",
	getQuartzComponents() {
		return [];
	},
	async emit({ argv, cfg }: BuildCtx): Promise<FilePath[]> {
		const staticPath = "static";
		const publicPath = argv.output;
		try {
			// Ensure static path exists
			if (!fs.existsSync(staticPath)) {
				console.log("Static directory does not exist, skipping copy.");
				return [];
			}

			// Use glob to find all files in static directory, respecting ignore patterns
			const files = await glob(
				"**/*",
				staticPath,
				cfg.configuration.ignorePatterns,
			);
			const outputFiles: FilePath[] = [];

			for (const file of files) {
				const sourceFilePath = path.join(staticPath, file) as FilePath;

				// Skip if it's a directory (glob might return directories)
				if ((await fs.promises.lstat(sourceFilePath)).isDirectory()) {
					continue;
				}

				const destFilePath = path.join(publicPath, file) as FilePath;
				const destDir = path.dirname(destFilePath);

				// Ensure destination directory exists
				await fs.promises.mkdir(destDir, { recursive: true });

				// Copy file
				await fs.promises.copyFile(sourceFilePath, destFilePath);
				outputFiles.push(destFilePath);
			}

			if (outputFiles.length > 0) {
				console.log(
					`Successfully copied ${outputFiles.length} files from static/ to public/`,
				);
			}

			return outputFiles;
		} catch (err) {
			console.error("Error copying static files:", err);
			return [];
		}
	},
});

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
	configuration: {
		pageTitle: "⚡The Corpuscle",
		pageTitleSuffix: "",
		enableSPA: true,
		enablePopovers: true,
		analytics: {
			provider: "postHog",
		},
		baseUrl: "blog.plasticlabs.ai",
		ignorePatterns: ["private", "templates"],
		locale: "en-US",
		defaultDateType: "created",
		theme: {
			fontOrigin: "googleFonts",
			cdnCaching: true,
			typography: {
				header: "Departure Mono",
				body: "Roboto Mono",
				code: "Ubuntu Mono",
			},
			colors: {
				lightMode: {
					light: "#E2E2E2",
					lightgray: "#4e4e4e", //code, graph, outline
					gray: "#4e4e4e", // graph nodes
					darkgray: "#4e4e4e",
					dark: "#4E4E4E",
					secondary: "#4e4e4e",
					tertiary: "#C0FFE1",
					highlight: "rgba(128, 128, 128, 0.35)", //code bg, note bg, graph bg (ONLY ON LIGHT MODE)
					textHighlight: "#fff23688",
					customCallout: "rgba(183, 255, 236, 0.35)",
					searchBackground: "#D3D3D3",
				},
				darkMode: {
					light: "#191919",
					lightgray: "#393639", //code, graph edges, outline
					gray: "#E2E2E2", //graph nodes
					darkgray: "#E2E2E2",
					dark: "#ebebec",
					secondary: "#7C7C7C",
					tertiary: "#C0FFE1",
					highlight: "rgba(125, 125, 125, 0.15)", //code bg, note bg
					textHighlight: "#b3aa0288",
					customCallout: "#00b8d410",
					searchBackground: "#252525",
				},
			},
		},
	},
	plugins: {
		transformers: [
			Plugin.FrontMatter(),
			Plugin.CreatedModifiedDate({
				priority: ["frontmatter", "filesystem"],
			}),
			Plugin.Latex({ renderEngine: "katex" }),
			Plugin.SyntaxHighlighting({
				theme: {
					light: "github-light",
					dark: "github-dark",
				},
				keepBackground: false,
			}),
			Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
			Plugin.GitHubFlavoredMarkdown({ enableSmartyPants: false }),
			Plugin.TableOfContents(),
			Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
			Plugin.Description(),
		],
		filters: [Plugin.RemoveDrafts()],
		emitters: [
			Plugin.AliasRedirects(),
			Plugin.ComponentResources({ fontOrigin: "googleFonts" }),
			Plugin.ContentPage(),
			Plugin.FolderPage(),
			Plugin.TagPage(),
			Plugin.ContentIndex({
				enableSiteMap: true,
				enableRSS: true,
			}),
			Plugin.Assets(),
			CopyStatic(),
			Plugin.Static(),
			Plugin.Favicon(),
			Plugin.NotFoundPage(),
			Plugin.CustomOgImages({
				defaultImage: "/og-image.png",
			}),
			Plugin.LLMSTxt(),
		],
	},
};

export default config;
