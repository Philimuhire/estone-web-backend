import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

type ProjectCategory = 'residential' | 'commercial';

interface ProjectAttributes {
  id: number;
  title: string;
  description: string;
  category: ProjectCategory;
  location: string;
  image: string;
  gallery: string[];
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'featured' | 'gallery'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: ProjectCategory;
  public location!: string;
  public image!: string;
  public gallery!: string[];
  public featured!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('residential', 'commercial'),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Extra photos shown on the project page, alongside the main `image`.
    gallery: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'projects',
    indexes: [
      { fields: ['category'] },
      { fields: ['featured'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Project;
