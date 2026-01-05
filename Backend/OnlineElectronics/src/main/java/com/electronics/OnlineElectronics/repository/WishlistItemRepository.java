package com.electronics.OnlineElectronics.repository;

import com.electronics.OnlineElectronics.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemRepository extends JpaRepository<WishlistItem,Long> {
}
