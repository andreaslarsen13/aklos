import { Button } from "@/components/ui/button";
import { MenuBar } from "@/components/layout/MenuBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/stores/useThemeStore";

interface AklosMenuBarProps {
  onClose: () => void;
  onShowHelp?: () => void;
  onShowAbout?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function AklosMenuBar({
  onClose,
  onShowHelp,
  onShowAbout,
  isFullscreen = false,
  onToggleFullscreen,
}: AklosMenuBarProps) {
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = currentTheme === "xp" || currentTheme === "win98";

  return (
    <MenuBar inWindowFrame={isXpTheme}>
      {/* aklOS Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            aklOS
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onShowAbout}>
            About aklOS
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Preferences...</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onClose}>Close Window</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem 
            onSelect={() => onToggleFullscreen?.()}
          >
            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Reset Canvas Position</DropdownMenuItem>
          <DropdownMenuItem disabled>Zoom to Fit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Show Grid</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onShowHelp}>aklOS Help</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Keyboard Shortcuts</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MenuBar>
  );
}

