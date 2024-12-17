import { useState, useCallback } from "react";

export default function useMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return { menuOpen, openMenu, closeMenu };
}