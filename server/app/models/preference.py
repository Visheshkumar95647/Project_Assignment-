from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Table,
    Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


preference_category = Table(
    "preference_category",
    Base.metadata,
    Column(
        "preference_id",
        Integer,
        ForeignKey("preferences.id"),
        primary_key=True,
    ),
    Column(
        "category_id",
        Integer,
        ForeignKey("categories.id"),
        primary_key=True,
    ),
)


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    dietary_restrictions = Column(
        Text,
        nullable=True,
        default=None,
    )

    user = relationship(
        "User",
        back_populates="preferences",
    )

    favorite_categories = relationship(
        "Category",
        secondary=preference_category,
        backref="pareferences",
    )