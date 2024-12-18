package com.aplicacion.backendcitas.model.entidades;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToOne;


@MappedSuperclass //para que no cree la tabla en la base de datos
public abstract class Persona {

    private String nombre;
    private String apellidos;
    private String telefono;

    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true, nullable = true) // PROVISIONAL opcional para que no haya que cambiar los insert
    private Usuario usuario;

    public Persona(){

    }

    public Persona(String nombre, String apellidos, String telefono, Usuario usuario){
        this.nombre=nombre;
        this.apellidos=apellidos;
        this.telefono=telefono;
        this.usuario=usuario;
    }


    public String getNombre(){
        return nombre;
    }

    public void setNombre(String nombre){
        this.nombre=nombre;
    }

    public String getApellidos(){
        return apellidos;
    }

    public void setApellidos(String apellidos){
        this.apellidos=apellidos;
    }
    
    public String getTelefono(){
        return telefono;
    }

    public void setTelefono(String telefono){
        this.telefono=telefono;
    }

    public void setUsuario(Usuario usuario){
        this.usuario=usuario;
    }

    public Usuario getUsuario(){
        return usuario;
    }

    
}
